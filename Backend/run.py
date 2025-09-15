from app import create_app

app = create_app()

if __name__ == '__main__':
    # Debug=True for development
    app.run(debug=True, port=5000)
