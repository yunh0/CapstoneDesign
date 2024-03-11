import React from 'react';
import '../cssfiles/signupPage.css';

class SignupPage extends React.Component {
    render() {
        return (
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form action="signup_process.php" method="post">
                    <input type="text" name="username" placeholder="Username" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <input type="password" name="confirm_password" placeholder="Confirm Password" required />
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        );
    }
}

export default SignupPage;