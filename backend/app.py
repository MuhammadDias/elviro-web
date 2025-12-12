import os
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory, send_file, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, date
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash # <-- TAMBAHAN IMPORT PENTING

app = Flask(__name__)
app.secret_key = 'elviro_secret_key_rahasia'
CORS(app) 

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'elviro.db')
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')

for folder in ['cv', 'team', 'news_thumb', 'news_doc', 'gallery_thumb', 'gallery_photo', 'achievement']:
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], folder), exist_ok=True)

db = SQLAlchemy(app)

# --- MODELS ---

# 1. MODEL ADMIN (BARU - UNTUK LOGIN & SIGNUP)
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) # Password akan di-hash

class RecruitmentConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    closed_message = db.Column(db.Text)

class Applicant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    nrp = db.Column(db.String(50))
    major = db.Column(db.String(100))
    department = db.Column(db.String(100))
    batch = db.Column(db.String(20))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    cv_path = db.Column(db.String(200))
    portfolio_link = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    position = db.Column(db.String(100))
    period = db.Column(db.String(20)) 
    photo = db.Column(db.String(200))
    nrp = db.Column(db.String(50))
    major = db.Column(db.String(100))
    batch = db.Column(db.String(20))
    division = db.Column(db.String(100))
    show_on_home = db.Column(db.Boolean, default=False) 

class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    summary = db.Column(db.String(300), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    thumbnail = db.Column(db.String(200))
    document = db.Column(db.String(200))
    link = db.Column(db.String(200))

class GalleryEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    year = db.Column(db.String(10))
    location = db.Column(db.String(100))
    thumbnail = db.Column(db.String(200))

class GalleryPhoto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('gallery_event.id'))
    photo = db.Column(db.String(200))

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer)
    event = db.Column(db.String(200))
    category = db.Column(db.String(200))
    result = db.Column(db.String(200))
    description = db.Column(db.Text)
    photo = db.Column(db.String(200))

# --- API ROUTES ---

# 2. ROUTE SIGNUP (BARU)
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'success': False, 'message': 'Username dan Password wajib diisi'}), 400

    # Cek apakah username sudah ada
    if Admin.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username sudah digunakan'}), 400

    # Hash password sebelum simpan
    hashed_password = generate_password_hash(password)
    
    new_admin = Admin(username=username, password=hashed_password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Admin berhasil didaftarkan'})

# 3. ROUTE LOGIN (DIUPDATE KE DATABASE)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Cek database
    user = Admin.query.filter_by(username=username).first()

    # Validasi password hash
    if user and check_password_hash(user.password, password):
        return jsonify({'success': True})
    
    # Fallback untuk login admin lama (hardcoded) jika database kosong/belum migrasi
    if username == 'admin' and password == 'elviro123':
         return jsonify({'success': True})

    return jsonify({'success': False, 'message': 'Username atau Password salah'}), 401

@app.route('/api/team')
def get_team():
    only_home = request.args.get('home')
    if only_home: team = Team.query.filter_by(show_on_home=True).all()
    else: team = Team.query.order_by(Team.period.desc()).all()
    return jsonify([{ 'id': t.id, 'name': t.name, 'position': t.position, 'division': t.division, 'photo': t.photo, 'nrp': t.nrp, 'major': t.major, 'batch': t.batch, 'period': t.period, 'show_on_home': t.show_on_home } for t in team])

@app.route('/api/admin/team/update', methods=['POST'])
def update_team():
    try:
        t_id = request.form['id']
        t = Team.query.get(t_id)
        if not t: return jsonify({'error': 'Not Found'}), 404

        t.name = request.form['name']
        t.position = request.form['position']
        t.period = request.form['period']
        t.nrp = request.form['nrp']
        t.major = request.form['major']
        t.batch = request.form['batch']
        t.division = request.form.get('division')

        if 'photo' in request.files:
            p = request.files['photo']
            if p.filename != '':
                p.save(os.path.join(app.config['UPLOAD_FOLDER'], 'team', p.filename))
                t.photo = p.filename
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/admin/team/toggle', methods=['POST'])
def toggle_team_home():
    d = request.json; m = Team.query.get(d['id'])
    if m: m.show_on_home = d['show']; db.session.commit(); return jsonify({'success': True})
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/admin/team/delete/<int:id>', methods=['DELETE'])
def delete_team(id):
    m = Team.query.get(id)
    if m: db.session.delete(m); db.session.commit(); return jsonify({'success': True})
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/achievements')
def get_achievements():
    ach = Achievement.query.order_by(Achievement.year.desc()).all()
    return jsonify([{ 'id': a.id, 'year': a.year, 'event': a.event, 'category': a.category, 'result': a.result, 'description': a.description, 'photo': a.photo } for a in ach])

@app.route('/api/admin/achievement/update', methods=['POST'])
def update_achievement():
    try:
        a = Achievement.query.get(request.form['id'])
        if not a: return jsonify({'error': 'Not Found'}), 404
        a.year = int(request.form['year'])
        a.event = request.form['event']
        a.category = request.form['category']
        a.result = request.form['result']
        a.description = request.form['description']
        if 'photo' in request.files:
            p = request.files['photo']
            if p.filename != '':
                p.save(os.path.join(app.config['UPLOAD_FOLDER'], 'achievement', p.filename))
                a.photo = p.filename
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/admin/achievement/delete/<int:id>', methods=['DELETE'])
def delete_achievement(id):
    a = Achievement.query.get(id)
    if a: db.session.delete(a); db.session.commit(); return jsonify({'success': True})
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/news', methods=['GET'])
def get_news_list():
    news = News.query.order_by(News.date.desc()).all()
    return jsonify([{
        'id': n.id, 'title': n.title, 
        'summary': n.summary if n.summary else ((n.content[:150] + '...') if n.content and len(n.content) > 150 else (n.content or "")),
        'content': n.content,
        'date': n.date.strftime('%d %B %Y'), 
        'thumbnail': n.thumbnail, 
        'document': n.document, 
        'link': n.link
    } for n in news])

@app.route('/api/news/<int:id>', methods=['GET'])
def get_news_detail(id):
    n = News.query.get(id)
    if not n: return jsonify({'error': 'Not Found'}), 404
    return jsonify({
        'id': n.id, 'title': n.title, 'content': n.content, 
        'summary': n.summary if n.summary else ((n.content[:150] + '...') if n.content and len(n.content) > 150 else (n.content or "")),
        'date': n.date.strftime('%d %B %Y'), 
        'thumbnail': n.thumbnail, 'document': n.document, 'link': n.link
    })

@app.route('/api/admin/news/update', methods=['POST'])
def update_news():
    try:
        n = News.query.get(request.form['id'])
        if not n: return jsonify({'error': 'Not Found'}), 404
        
        n.title = request.form['title']
        n.summary = request.form.get('summary', '')
        n.content = request.form['content']
        n.link = request.form['link']
        
        if 'thumbnail' in request.files:
            t = request.files['thumbnail']
            if t.filename != '':
                t.save(os.path.join(app.config['UPLOAD_FOLDER'], 'news_thumb', t.filename))
                n.thumbnail = t.filename
        
        if 'document' in request.files:
            d = request.files['document']
            if d.filename != '':
                d.save(os.path.join(app.config['UPLOAD_FOLDER'], 'news_doc', d.filename))
                n.document = d.filename

        db.session.commit()
        return jsonify({'success': True})
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/admin/news/delete/<int:id>', methods=['DELETE'])
def delete_news(id):
    n = News.query.get(id)
    if n: 
        db.session.delete(n)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/gallery/events')
def get_events(): return jsonify([{'id': e.id, 'title': e.title, 'year': e.year, 'location': e.location, 'thumbnail': e.thumbnail} for e in GalleryEvent.query.all()])

@app.route('/api/gallery/photos/<int:id>')
def get_photos(id): return jsonify([{'photo': p.photo} for p in GalleryPhoto.query.filter_by(event_id=id).all()])

@app.route('/api/config')
def get_config():
    c = RecruitmentConfig.query.first()
    if not c: return jsonify({'is_open': False})
    return jsonify({'is_open': c.start_date <= date.today() <= c.end_date, 'start': c.start_date.strftime('%Y-%m-%d'), 'end': c.end_date.strftime('%Y-%m-%d'), 'message': c.closed_message})

@app.route('/api/join', methods=['POST'])
def join():
    try:
        d = request.form; f = request.files['cv']; fn = f"{d['nrp']}_{f.filename}"; f.save(os.path.join(app.config['UPLOAD_FOLDER'], 'cv', fn))
        db.session.add(Applicant(name=d['name'], nrp=d['nrp'], major=d['major'], department=d['department'], batch=d['batch'], email=d['email'], phone=d['phone'], height=int(d['height']), weight=int(d['weight']), cv_path=fn, portfolio_link=d['portfolio']))
        db.session.commit(); return jsonify({'message': 'Ok'})
    except Exception as e: return jsonify({'error': str(e)}), 500

@app.route('/api/admin/config', methods=['POST'])
def update_config():
    d = request.json; c = RecruitmentConfig.query.first(); s = datetime.strptime(d['start_date'], '%Y-%m-%d').date(); e = datetime.strptime(d['end_date'], '%Y-%m-%d').date()
    if not c: db.session.add(RecruitmentConfig(start_date=s, end_date=e, closed_message=d['message']))
    else: c.start_date = s; c.end_date = e; c.closed_message = d['message']
    db.session.commit(); return jsonify({'success': True})

@app.route('/api/applicants')
def get_applicants():
    apps = Applicant.query.order_by(Applicant.created_at.desc()).all()
    return jsonify([{ 'id': a.id, 'name': a.name, 'nrp': a.nrp, 'major': a.major, 'department': a.department, 'batch': a.batch, 'email': a.email, 'phone': a.phone, 'height': a.height, 'weight': a.weight, 'cv_path': a.cv_path, 'portfolio': a.portfolio_link, 'date': a.created_at.strftime('%d-%m-%Y')} for a in apps])

@app.route('/api/admin/applicant/delete/<int:id>', methods=['DELETE'])
def delete_applicant(id):
    a = Applicant.query.get(id)
    if a: db.session.delete(a); db.session.commit(); return jsonify({'success': True})
    return jsonify({'error': 'Not found'}), 404

@app.route('/admin/upload', methods=['POST'])
def admin_upload():
    try:
        if 'add_team' in request.form:
            p = request.files['photo']; p.save(os.path.join(app.config['UPLOAD_FOLDER'], 'team', p.filename))
            db.session.add(Team(name=request.form['name'], position=request.form['position'], division=request.form.get('division'), period=request.form['period'], photo=p.filename, nrp=request.form['nrp'], major=request.form['major'], batch=request.form['batch']))
        
        elif 'add_news' in request.form:
            t = request.files.get('thumbnail'); d = request.files.get('document'); tn = t.filename if t else None; dn = d.filename if d else None
            if t: t.save(os.path.join(app.config['UPLOAD_FOLDER'], 'news_thumb', tn))
            if d: d.save(os.path.join(app.config['UPLOAD_FOLDER'], 'news_doc', dn))
            
            content_text = request.form['content']
            summary_text = content_text[:150] + "..." if len(content_text) > 150 else content_text
            
            db.session.add(News(
                title=request.form['title'], 
                content=content_text, 
                summary=summary_text, 
                thumbnail=tn, 
                document=dn, 
                link=request.form['link']
            ))
            
        elif 'add_event' in request.form:
            t = request.files['thumbnail']; t.save(os.path.join(app.config['UPLOAD_FOLDER'], 'gallery_thumb', t.filename))
            db.session.add(GalleryEvent(title=request.form['title'], year=request.form['year'], location=request.form['location'], thumbnail=t.filename))
        elif 'add_photo' in request.form:
            photos = request.files.getlist('photos')
            for p in photos: p.save(os.path.join(app.config['UPLOAD_FOLDER'], 'gallery_photo', p.filename)); db.session.add(GalleryPhoto(event_id=request.form['event_id'], photo=p.filename))
        elif 'add_achievement' in request.form:
            photo = request.files['photo']; photo.save(os.path.join(app.config['UPLOAD_FOLDER'], 'achievement', photo.filename))
            db.session.add(Achievement(year=int(request.form['year']), event=request.form['event'], category=request.form['category'], result=request.form['result'], description=request.form['description'], photo=photo.filename))
        db.session.commit(); return jsonify({'success': True})
    except Exception as e: return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/uploads/<path:filename>')
def serve_uploads(filename): return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/admin/export')
def export_excel():
    applicants = Applicant.query.order_by(Applicant.created_at.desc()).all()
    data = []
    for a in applicants: data.append({ 'Tanggal': a.created_at.strftime('%Y-%m-%d'), 'Nama': a.name, 'NRP': a.nrp, 'Jurusan': a.major, 'Email': a.email, 'HP': a.phone, 'TB': a.height, 'BB': a.weight, 'CV': a.cv_path })
    if not data: df = pd.DataFrame(columns=['Belum ada pendaftar'])
    else: df = pd.DataFrame(data)
    fn = 'Data_Pendaftar_ELVIRO.xlsx'; out = os.path.join(app.config['UPLOAD_FOLDER'], fn); df.to_excel(out, index=False); return send_file(out, as_attachment=True, download_name=fn)

# --- FUNGSI SEED & FIX SCHEMA ---
def seed_data():
    if not RecruitmentConfig.query.first():
        db.session.add(RecruitmentConfig(start_date=date.today(), end_date=date.today(), closed_message="Closed."))
    
    if not Achievement.query.first():
        data = [
            {"year": 2024, "event": "KMHE 2024", "category": "Prototype Listrik", "result": "Best Tech Report & Finalist", "desc": "Penghargaan laporan teknis terbaik."},
            {"year": 2023, "event": "KMHE 2023", "category": "Prototype Listrik", "result": "Finalist", "desc": "Finalis Nasional."},
            {"year": 2022, "event": "KMHE 2022", "category": "Prototype Listrik", "result": "Finalist", "desc": "Kompetisi di sirkuit GBT Surabaya."},
            {"year": 2020, "event": "KMHE 2020", "category": "Prototype Listrik", "result": "2nd Rank", "desc": "Juara 2 Nasional secara daring."},
            {"year": 2019, "event": "KMHE 2019", "category": "Prototype Listrik", "result": "4th Rank", "desc": "Peringkat 4 Nasional di Malang."},
            {"year": 2016, "event": "KMHE 2016", "category": "Urban & Prototype", "result": "Winner", "desc": "Juara di dua kategori sekaligus."},
            {"year": 2012, "event": "IEMC 2012", "category": "Urban Listrik", "result": "Runner Up", "desc": "Prestasi awal tim ELVIRO (Chapens)."}
        ]
        for d in data:
            db.session.add(Achievement(year=d['year'], event=d['event'], category=d['category'], result=d['result'], description=d['desc'], photo="default.jpg"))
    db.session.commit()

def fix_schema():
    # Cek & Tambah Tabel Admin jika belum ada
    try:
        db.session.execute(text("SELECT username FROM admin LIMIT 1"))
    except Exception:
        db.session.rollback()
        print("Tabel Admin tidak ditemukan. Membuat tabel...")
        db.create_all() # Ini akan membuat tabel Admin karena class Admin sudah didefinisikan

    # Cek kolom summary di News
    try:
        db.session.execute(text("SELECT summary FROM news LIMIT 1"))
    except Exception:
        db.session.rollback()
        print("Kolom 'summary' tidak ditemukan. Migrasi database...")
        try:
            db.session.execute(text("ALTER TABLE news ADD COLUMN summary VARCHAR(300)"))
            db.session.commit()
        except Exception as e: print(f"Gagal migrasi News: {e}")

    # Cek kolom division di Team
    try:
        db.session.execute(text("SELECT division FROM team LIMIT 1"))
    except Exception:
        db.session.rollback()
        print("Kolom 'division' tidak ditemukan. Migrasi database...")
        try:
            db.session.execute(text("ALTER TABLE team ADD COLUMN division VARCHAR(100)"))
            db.session.commit()
        except Exception as e: print(f"Gagal migrasi Team: {e}")

    try:
        db.session.execute(text("UPDATE team SET show_on_home = 1 WHERE show_on_home IS NULL"))
        db.session.commit()
    except Exception as e: print(f"Gagal update data lama: {e}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        fix_schema()
        seed_data()
    app.run(debug=True, port=5000)