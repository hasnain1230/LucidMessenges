from datetime import timedelta

from flask import request, jsonify, current_app
from email_validator import validate_email, EmailNotValidError
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import BadRequest

from ..models import User
from .. import db
from ..util.email import send_email
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from . import bp  # Import the blueprint from the current package


def send_user_email(user, body=None, subject=None):
    verification_code = user.verification_code
    user_email = user.email
    body = f"Your verification code is: {verification_code}" if not body else body
    subject = "Lucid Messages -- Email Verification" if not subject else subject

    with current_app.app_context():
        send_email(user_email, subject, body)


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirmed_password = data.get('confirmed_password')

    if not username or not email or not password or not confirmed_password:
        return jsonify({"error": "All fields are required"}), 400

    if password != confirmed_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if len(username) < 3 or len(username) > 32:
        return jsonify({"error": "Username must be between 3 and 32 characters"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({"error": "Invalid email address"}), 400

    user = User(username=username, email=email, password=password)

    try:
        db.session.add(user)
        db.session.commit()

        send_user_email(user)

        return jsonify(
            {"message": "Account created successfully. Please check your email for the verification code"}), 201

    except IntegrityError as e:
        # Find the user by email and check if the user is not verified
        db.session.rollback()
        db.session.flush()

        user = User.query.filter((User.email == email) | (User.username == username)).first()

        # Check if username already exists in the database

        if not user.is_verified:
            user.generate_verification_code()  # Regenerate the verification code
            send_user_email(user)
            return jsonify({"message": "Verification code resent"}), 200

        current_app.logger.error(f"Failed to create user, user already exists: {e}")

        if user.username == username:
            return jsonify({"error": "Username already exists"}), 400
        elif user.email == email:
            return jsonify({"error": "Email already exists"}), 400
        else:
            return jsonify({"error": "User already exists"}), 400
    except ValueError as e:
        current_app.logger.error(f"error: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"error: {e}")
        return jsonify({"error": f"Internal server error: {e}"}), 500


@bp.route('/verify-email', methods=['POST'])
def verify_email():
    try:
        data = request.get_json()

        if not data:
            current_app.logger.error("Verify Email: No data provided")
            return jsonify({"error": "No data provided"}), 400

        email = data.get('email')
        verification_code = data.get('verification_code')

        if not email or not verification_code:
            return jsonify({"error": "All fields are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.verify_email(verification_code):
            db.session.commit()  # Commit the changes to the database
            return jsonify({"message": "Email verified successfully. You can now login"}), 200
        else:
            return jsonify({"error": "Invalid verification code"}), 400

    except BadRequest as e:
        current_app.logger.error(f"BadRequest Error: {e}")
        return jsonify({"error": "Invalid data provided"}), 400
    except Exception as e:
        current_app.logger.error(f"Error: {e}")
        return jsonify({"error": f"Internal server error: {e}"}), 500


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email_or_username = data.get('email/username')
    password = data.get('password')

    if not email_or_username or not password:
        return jsonify({"error": "Username and password are required!"}), 400

    user = User.query.filter((User.email == email_or_username) | (User.username == email_or_username)).first()

    if user and user.check_password(password):
        if not user.is_verified:
            return jsonify({"error": "Email not verified"}), 400

        access_token = create_access_token(identity=user.username, expires_delta=timedelta(days=7))

        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"error": "Invalid username/email or password"}), 400


@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required}"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "If a user with this email exists, a reset code has been sent"}), 200

    user.generate_reset_code()
    db.session.commit()

    # Send the reset code to the user's email
    reset_code = user.reset_code
    body = f"Your password reset code is: {reset_code}"
    subject = "Lucid Messages -- Password Reset Code"

    send_user_email(user, body=body, subject=subject)

    return jsonify({"message": "If a user with this email exists, a reset code has been sent"}), 200


@bp.route('/verify-reset-code', methods=['POST'])
def verify_reset_code():
    data = request.get_json()
    email = data.get('email')
    reset_code = data.get('reset_code')

    if not email or not reset_code:
        return jsonify({"error": "Email and reset code are required!"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.verify_reset_code(reset_code):
        return jsonify({"error": "Invalid reset code"}), 400

    return jsonify({"message": "Reset code verified successfully"}), 200


@bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    reset_code = data.get('reset_code')
    new_password = data.get('new_password')
    confirmed_password = data.get('confirmed_password')

    if not email or not reset_code or not new_password or not confirmed_password:
        return jsonify({"error": "Email, reset code, and new password are required"}), 400

    if new_password != confirmed_password:
        return jsonify({"error": "Passwords do not match"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.verify_reset_code(reset_code):
        return jsonify({"error": "Invalid reset code"}), 400

    user.reset_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password reset successfully"}), 200


@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(username=current_user_id).first()
        if user:
            return jsonify({"status": "success", "username": user.username}), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
