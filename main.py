from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate

# Initialize Flask app and extensions
app = Flask(__name__)
app.config.from_object('config.Config')
db = SQLAlchemy(app)
migrate =  Migrate(app,db)
login_manager = LoginManager(app)
login_manager.login_view = 'login'  # Redirect unauthorized users to the login page


# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)


class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    guests = db.Column(db.Integer, nullable=False)


# Add the user_loader function
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Routes and views
@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/menu')
def menu():
    return render_template('menu.html')


# Reservation route (no duplicates)
@app.route('/reservation', methods=['GET', 'POST'])
def reservation():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        date = request.form['date']
        time = request.form['time']
        guests = request.form['guests']

        # Save the reservation to the database
        new_reservation = Reservation(name=name, email=email, date=date, time=time, guests=guests)
        db.session.add(new_reservation)
        db.session.commit()

        flash('Reservation successful!', 'success')
        return redirect(url_for('home'))
    return render_template('reservation.html')


@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        flash('You are not authorized to view this page', 'danger')
        return redirect(url_for('home'))

    # Fetching all reservations for the admin
    reservations = Reservation.query.all()
    return render_template('admin.html', reservations=reservations)


@app.route('/delete_reservation/<int:id>', methods=['GET'])
@login_required
def delete_reservation(id):
    if not current_user.is_admin:
        flash('You are not authorized to delete reservations', 'danger')
        return redirect(url_for('home'))

    reservation = Reservation.query.get_or_404(id)
    db.session.delete(reservation)
    db.session.commit()

    flash('Reservation deleted successfully!', 'success')
    return redirect(url_for('admin'))


# User authentication routes (simplified)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('home'))
        else:
            flash('Login failed. Check your username and password.', 'danger')
    return render_template('login.html')

@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
