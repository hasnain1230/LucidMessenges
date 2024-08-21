from app import create_app, init_db

app = create_app()


@app.route('/')
def index():
    return "Hello, World!"


if __name__ == '__main__':
    init_db(app)

    app.run(debug=True)