from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:epfub76**@localhost/Errors'  # Замените на ваши реальные данные
db = SQLAlchemy(app)
app.app_context().push()

class Errors(db.Model):
    #id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255), primary_key=True)
    errtext = db.Column(db.String(255))
    recommendation = db.Column(db.String(255))
    obj = db.Column(db.String(255))
db.create_all()


@app.route('/')
def index():
    errors = Errors.query.all()
    return render_template('index.html', errors=errors)
    #return jsonify({'errors': [{'code': error.code, 'errtext': error.errtext, 'recommendation': error.recommendation, 'obj': error.obj} for error in errors]})

@app.route('/add', methods=['POST'])
def add_error():
    data = request.get_json()
    error = Errors(**data)
    db.session.add(error)
    db.session.commit()
    return jsonify({'message': 'Error added successfully'})
@app.route('/update', methods=['PUT'])

def add_or_update_error():
    data = request.get_json()

    if 'id' in data:
        # If 'id' is present, it's an update
        error_id = data.pop('id')
        error = Errors.query.get(error_id)
        for key, value in data.items():
            setattr(error, key, value)
    else:
        # If 'id' is not present, it's an add
        error = Errors(**data)

    db.session.add(error)
    db.session.commit()

    return jsonify({'message': 'Error added/updated successfully'})

@app.route('/delete', methods=['POST'])
def delete_error():
    ids = request.get_json()['ids']
    Errors.query.filter(Errors.id.in_(ids)).delete(synchronize_session='fetch')
    db.session.commit()
    return jsonify({'message': 'Errors deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
