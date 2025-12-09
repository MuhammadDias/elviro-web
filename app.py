import os
import pandas as pd
from flask import Flask, render_template, request, redirect, url_for, session, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'elviro_secret_key_rahasia' 

# --- KONFIGURASI ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'elviro.db')
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')

# Buat folder upload lengkap (tambah folder gallery)
for folder in ['cv', 'team', 'news', 'gallery']:
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], folder), exist_ok=True)

db = SQLAlchemy(app)

# --- MODEL DATABASE ---
class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    position = db.Column(db.String(100))
    period = db.Column(db.String(20)) 
    photo = db.Column(db.String(200))

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Gallery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))    # Contoh: KMHE 2024
    year = db.Column(db.String(10))      # Contoh: 2024
    location = db.Column(db.String(100)) # Contoh: Jakarta
    photo = db.Column(db.String(200))    # Nama file foto

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

# --- ROUTES HALAMAN USER ---

@app.route('/')
def home():
    news_list = News.query.order_by(News.date.desc()).all()
    return render_template('home.html', news=news_list)

@app.route('/gallery')
def gallery():
    return render_template('gallery.html') # Halaman baru untuk React Gallery

# Route Statis Lainnya
@app.route('/about')
def about(): return render_template('generic.html', title="About Us", content="ELVIRO adalah tim mobil surya kebanggaan PENS...")

@app.route('/history')
def history(): return render_template('generic.html', title="History", content="Sejarah perjalanan tim ELVIRO...")

@app.route('/contact')
def contact(): return render_template('generic.html', title="Contact Us", content="Hubungi kami di Gedung D4 PENS.")

@app.route('/achievement')
def achievement():
    achievements_data = [
        {"year": "2024", "event": "KMHE 2024", "category": "Prototype Listrik", "result": "Best Technical Report & Finalist"},
        {"year": "2023", "event": "KMHE 2023", "category": "Prototype Listrik", "result": "Finalist"},
        {"year": "2022", "event": "KMHE 2022", "category": "Prototype Listrik", "result": "Finalist"},
        {"year": "2021", "event": "KMHE 2021", "category": "Prototype Listrik", "result": "Semifinalist"},
        {"year": "2020", "event": "KMHE 2020", "category": "Prototype Listrik", "result": "2nd Rank"},
        {"year": "2019", "event": "KMHE 2019", "category": "Prototype Listrik", "result": "4th Rank"},
        {"year": "2017", "event": "KMHE 2017", "category": "Prototype Listrik", "result": "Harapan 5"},
        {"year": "2016", "event": "KMHE 2016", "category": "Urban & Prototype", "result": "Urban (4th), Prototype (3rd)"},
        {"year": "2015", "event": "KMHE & KMLI", "category": "Prototype Listrik", "result": "Harapan 5"},
        {"year": "2014", "event": "IEMC 2014", "category": "Urban & Prototype", "result": "6th Rank"},
        {"year": "2013", "event": "IEMC 2013", "category": "Urban & Prototype", "result": "Urban (3rd), Prototype (4th)"},
        {"year": "2012", "event": "IEMC 2012", "category": "Urban Listrik", "result": "Runner Up"}
    ]
    return render_template('achievement.html', achievements=achievements_data)

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
        return redirect(url_for('home')) 
    return render_template('join.html')

# --- API ENDPOINTS (JSON) ---
@app.route('/api/team')
def api_team():
    members = Team.query.filter_by(period='2025').all()
    return jsonify([{'name': m.name, 'position': m.position, 'photo': m.photo} for m in members])

@app.route('/api/gallery')
def api_gallery():
    # Mengambil semua foto galeri
    galleries = Gallery.query.all()
    data = []
    for g in galleries:
        data.append({
            'id': g.id,
            'title': g.title,
            'year': g.year,
            'location': g.location,
            'photo': g.photo
        })
    return jsonify(data)

# --- ADMIN AREA ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'admin' and request.form['password'] == 'elviro123':
            session['admin'] = True
            return redirect(url_for('admin_dashboard'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin', None)
    return redirect(url_for('home'))

@app.route('/admin', methods=['GET', 'POST'])
def admin_dashboard():
    if not session.get('admin'): return redirect(url_for('login'))
    
    if request.method == 'POST':
        # Upload Tim
        if 'add_team' in request.form:
            photo = request.files['photo']
            pname = photo.filename
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], 'team', pname))
            db.session.add(Team(name=request.form['name'], position=request.form['position'], period=request.form['period'], photo=pname))
        
        # Upload Berita
        elif 'add_news' in request.form:
            db.session.add(News(title=request.form['title'], content=request.form['content']))
            
        # Upload Gallery (BARU)
        elif 'add_gallery' in request.form:
            photo = request.files['photo']
            pname = f"gal_{request.form['year']}_{photo.filename}"
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], 'gallery', pname))
            db.session.add(Gallery(
                title=request.form['title'],
                year=request.form['year'],
                location=request.form['location'],
                photo=pname
            ))
            
        db.session.commit()
        return redirect(url_for('admin_dashboard'))

    applicants = Applicant.query.all()
    return render_template('admin.html', applicants=applicants)

@app.route('/admin/export')
def export_excel():
    if not session.get('admin'): return redirect(url_for('login'))
    statement = db.select(Applicant)
    df = pd.read_sql(statement, db.engine)
    output_path = os.path.join(basedir, 'pendaftar_elviro.xlsx')
    df.to_excel(output_path, index=False)
    return send_file(output_path, as_attachment=True)

# --- AUTO SEED DATA (ISI DATA OTOMATIS SESUAI GAMBAR) ---
def seed_data():
    if Gallery.query.first() is None:
        # Data dari gambar
        initial_galleries = [
            ("IEMC 2012", "2012", "Surabaya"),
            ("IEMC 2013", "2013", "Surabaya"),
            ("IEMC 2014", "2014", "Surabaya"),
            ("KMHE 2015", "2015", "Malang"),
            ("KMHE 2016", "2016", "Sleman"),
            ("KMHE 2017", "2017", "Surabaya"),
            ("KMHE 2019", "2019", "Surabaya"),
            ("KMHE 2020", "2020", "Surabaya"),
            ("KMHE 2022", "2022", "Surabaya"),
            ("KMHE 2023", "2023", "Jakarta"),
            ("KMHE 2024", "2024", "Jakarta"),
        ]
        print("--- MENAMBAHKAN DATA AWAL GALERI ---")
        for title, year, loc in initial_galleries:
            # Menggunakan placeholder image jika belum ada foto
            db.session.add(Gallery(title=title, year=year, location=loc, photo="default_gallery.jpg"))
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_data() # Jalankan fungsi isi data otomatis
    app.run(debug=True)