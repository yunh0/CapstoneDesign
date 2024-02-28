import React from "react";

class LoginPage extends React.Component {
    render() {
        return (
            <div className="container">
                <h2>Login</h2>
                <form action="login_process.php" method="post">
                    <input type="text" name="username" placeholder="Username" required />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}

export default LoginPage;
