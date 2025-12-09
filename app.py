import os
import pandas as pd
from flask import Flask, render_template, request, redirect, url_for, session, send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'elviro_secret_key' # Ganti dengan yang rahasia

# Konfigurasi Database & Upload
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'elviro.db')
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')

# Pastikan folder upload ada
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'cv'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'team'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'news'), exist_ok=True)

db = SQLAlchemy(app)

# --- MODEL DATABASE (SQL) ---
class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    position = db.Column(db.String(100))
    period = db.Column(db.String(20)) # Contoh: 2024, 2023
    photo = db.Column(db.String(200))

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    image = db.Column(db.String(200))

class Applicant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    nrp = db.Column(db.String(50))
    major = db.Column(db.String(100))
    department = db.Column(db.String(100))
    batch = db.Column(db.String(10))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    cv_path = db.Column(db.String(200))
    portfolio_link = db.Column(db.String(200))

# --- ROUTES ---

@app.route('/')
def home():
    news_list = News.query.order_by(News.date.desc()).all()
    # Tampilkan tim periode sekarang (misal 2025)
    current_team = Team.query.filter_by(period='2025').all() 
    return render_template('home.html', news=news_list, team=current_team)

@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        file_cv = request.files['cv']
        filename = f"{request.form['nrp']}_{file_cv.filename}"
        file_cv.save(os.path.join(app.config['UPLOAD_FOLDER'], 'cv', filename))
        
        new_applicant = Applicant(
            name=request.form['name'], nrp=request.form['nrp'],
            major=request.form['major'], department=request.form['department'],
            batch=request.form['batch'], email=request.form['email'],
            phone=request.form['phone'], height=request.form['height'],
            weight=request.form['weight'], cv_path=filename,
            portfolio_link=request.form['portfolio']
        )
        db.session.add(new_applicant)
        db.session.commit()
        return "Pendaftaran Berhasil! Terima kasih."
    return render_template('join.html')

# --- ADMIN AREA ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'admin' and request.form['password'] == 'elviro123':
            session['admin'] = True
            return redirect(url_for('admin_dashboard'))
    return render_template('login.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin_dashboard():
    if not session.get('admin'): return redirect(url_for('login'))
    
    if request.method == 'POST':
        # Logic Upload Tim
        if 'add_team' in request.form:
            photo = request.files['photo']
            pname = photo.filename
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], 'team', pname))
            db.session.add(Team(
                name=request.form['name'], position=request.form['position'],
                period=request.form['period'], photo=pname
            ))
        
        # Logic Upload Berita
        elif 'add_news' in request.form:
            db.session.add(News(
                title=request.form['title'], content=request.form['content']
            ))
        
        db.session.commit()
        return redirect(url_for('admin_dashboard'))

    applicants = Applicant.query.all()
    return render_template('admin.html', applicants=applicants)

@app.route('/admin/export')
def export_excel():
    if not session.get('admin'): return redirect(url_for('login'))
    
    # Menggunakan Pandas untuk SQL ke Excel
    statement = db.select(Applicant)
    df = pd.read_sql(statement, db.engine)
    
    output_path = os.path.join(basedir, 'pendaftar_elviro.xlsx')
    df.to_excel(output_path, index=False)
    
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Membuat tabel database otomatis
    app.run(debug=True)