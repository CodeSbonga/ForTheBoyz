from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pandas as pd
import plotly.graph_objs as go
import plotly.utils
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'telkom-parental-dashboard-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////workspace/telkom-parental-dashboard/data/app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'parent', 'student', 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class StudyRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rule_type = db.Column(db.String(20), nullable=False)  # 'whitelist', 'blacklist'
    domain = db.Column(db.String(255), nullable=False)
    app_name = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class StudyMode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_enabled = db.Column(db.Boolean, default=False)
    start_time = db.Column(db.Time, nullable=True)
    end_time = db.Column(db.Time, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class UsageReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    study_time_minutes = db.Column(db.Integer, default=0)
    distraction_time_minutes = db.Column(db.Integer, default=0)
    total_time_minutes = db.Column(db.Integer, default=0)
    efficiency_percentage = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class GameScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_type = db.Column(db.String(50), nullable=False)  # 'puzzle', 'snake_ladder'
    score = db.Column(db.Integer, nullable=False)
    level = db.Column(db.Integer, default=1)
    played_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# API Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role
            }
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        role=data['role']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'User created successfully'})

@app.route('/api/study-mode', methods=['GET', 'POST'])
@login_required
def study_mode():
    if request.method == 'GET':
        study_mode = StudyMode.query.filter_by(user_id=current_user.id).first()
        if not study_mode:
            study_mode = StudyMode(user_id=current_user.id, is_enabled=False)
            db.session.add(study_mode)
            db.session.commit()
        
        return jsonify({
            'is_enabled': study_mode.is_enabled,
            'start_time': study_mode.start_time.strftime('%H:%M') if study_mode.start_time else None,
            'end_time': study_mode.end_time.strftime('%H:%M') if study_mode.end_time else None
        })
    
    elif request.method == 'POST':
        data = request.get_json()
        study_mode = StudyMode.query.filter_by(user_id=current_user.id).first()
        
        if not study_mode:
            study_mode = StudyMode(user_id=current_user.id)
            db.session.add(study_mode)
        
        study_mode.is_enabled = data.get('is_enabled', False)
        if data.get('start_time'):
            study_mode.start_time = datetime.strptime(data['start_time'], '%H:%M').time()
        if data.get('end_time'):
            study_mode.end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        
        study_mode.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True})

@app.route('/api/rules', methods=['GET', 'POST', 'DELETE'])
@login_required
def rules():
    if request.method == 'GET':
        rules = StudyRule.query.filter_by(user_id=current_user.id, is_active=True).all()
        return jsonify([{
            'id': rule.id,
            'rule_type': rule.rule_type,
            'domain': rule.domain,
            'app_name': rule.app_name
        } for rule in rules])
    
    elif request.method == 'POST':
        data = request.get_json()
        rule = StudyRule(
            user_id=current_user.id,
            rule_type=data['rule_type'],
            domain=data['domain'],
            app_name=data.get('app_name')
        )
        db.session.add(rule)
        db.session.commit()
        return jsonify({'success': True, 'id': rule.id})
    
    elif request.method == 'DELETE':
        rule_id = request.args.get('id')
        rule = StudyRule.query.filter_by(id=rule_id, user_id=current_user.id).first()
        if rule:
            rule.is_active = False
            db.session.commit()
            return jsonify({'success': True})
        return jsonify({'success': False}), 404

@app.route('/api/usage-reports', methods=['GET'])
@login_required
def usage_reports():
    days = int(request.args.get('days', 7))
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    reports = UsageReport.query.filter(
        UsageReport.user_id == current_user.id,
        UsageReport.date >= start_date,
        UsageReport.date <= end_date
    ).order_by(UsageReport.date).all()
    
    # Generate charts
    dates = [report.date.strftime('%Y-%m-%d') for report in reports]
    study_times = [report.study_time_minutes for report in reports]
    distraction_times = [report.distraction_time_minutes for report in reports]
    
    # Bar chart
    bar_chart = go.Figure(data=[
        go.Bar(name='Study Time', x=dates, y=study_times, marker_color='#0057B7'),
        go.Bar(name='Distraction Time', x=dates, y=distraction_times, marker_color='#FF6B6B')
    ])
    bar_chart.update_layout(
        title='Daily Usage Report',
        xaxis_title='Date',
        yaxis_title='Minutes',
        barmode='group',
        plot_bgcolor='white',
        paper_bgcolor='white'
    )
    
    # Pie chart
    total_study = sum(study_times)
    total_distraction = sum(distraction_times)
    pie_chart = go.Figure(data=[go.Pie(
        labels=['Study Time', 'Distraction Time'],
        values=[total_study, total_distraction],
        marker_colors=['#0057B7', '#FF6B6B']
    )])
    pie_chart.update_layout(
        title='Total Usage Distribution',
        plot_bgcolor='white',
        paper_bgcolor='white'
    )
    
    return jsonify({
        'reports': [{
            'date': report.date.strftime('%Y-%m-%d'),
            'study_time_minutes': report.study_time_minutes,
            'distraction_time_minutes': report.distraction_time_minutes,
            'efficiency_percentage': report.efficiency_percentage
        } for report in reports],
        'charts': {
            'bar_chart': json.dumps(bar_chart, cls=plotly.utils.PlotlyJSONEncoder),
            'pie_chart': json.dumps(pie_chart, cls=plotly.utils.PlotlyJSONEncoder)
        },
        'ai_recommendation': generate_ai_recommendation(total_study, total_distraction)
    })

@app.route('/api/game-scores', methods=['GET', 'POST'])
@login_required
def game_scores():
    if request.method == 'GET':
        scores = GameScore.query.filter_by(user_id=current_user.id).order_by(GameScore.played_at.desc()).limit(10).all()
        return jsonify([{
            'game_type': score.game_type,
            'score': score.score,
            'level': score.level,
            'played_at': score.played_at.strftime('%Y-%m-%d %H:%M')
        } for score in scores])
    
    elif request.method == 'POST':
        data = request.get_json()
        score = GameScore(
            user_id=current_user.id,
            game_type=data['game_type'],
            score=data['score'],
            level=data.get('level', 1)
        )
        db.session.add(score)
        db.session.commit()
        return jsonify({'success': True})

def generate_ai_recommendation(study_time, distraction_time):
    if distraction_time == 0:
        return "Excellent focus! Keep up the great work with your study routine."
    
    distraction_ratio = distraction_time / (study_time + distraction_time)
    
    if distraction_ratio > 0.5:
        return "Consider enabling stricter study mode. Distraction time is high - try focusing on educational content only."
    elif distraction_ratio > 0.3:
        return "Good balance! Consider reducing entertainment time slightly to improve study efficiency."
    else:
        return "Great study efficiency! Your current restrictions are working well."

# Initialize database
def init_db():
    with app.app_context():
        db.create_all()
        
        # Create default admin user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', email='admin@telkom.co.za', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
        
        # Create default parent user if not exists
        if not User.query.filter_by(username='parent').first():
            parent = User(username='parent', email='parent@telkom.co.za', role='parent')
            parent.set_password('parent123')
            db.session.add(parent)
        
        # Create default student user if not exists
        if not User.query.filter_by(username='student').first():
            student = User(username='student', email='student@telkom.co.za', role='student')
            student.set_password('student123')
            db.session.add(student)
        
        db.session.commit()
        
        # Create sample usage data
        create_sample_data()

def create_sample_data():
    student = User.query.filter_by(username='student').first()
    if student:
        # Create sample usage reports for the past 7 days
        for i in range(7):
            date = datetime.now().date() - timedelta(days=i)
            study_time = 120 + (i * 10)  # 2-3 hours
            distraction_time = 60 - (i * 5)  # 1 hour decreasing
            total_time = study_time + distraction_time
            efficiency = (study_time / total_time) * 100
            
            report = UsageReport(
                user_id=student.id,
                date=date,
                study_time_minutes=study_time,
                distraction_time_minutes=distraction_time,
                total_time_minutes=total_time,
                efficiency_percentage=efficiency
            )
            db.session.add(report)
        
        # Create sample game scores
        for i in range(5):
            score = GameScore(
                user_id=student.id,
                game_type='puzzle',
                score=100 + (i * 20),
                level=i + 1
            )
            db.session.add(score)
        
        db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)