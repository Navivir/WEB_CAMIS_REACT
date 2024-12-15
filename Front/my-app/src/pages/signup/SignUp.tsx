import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SignUp.css";

export const SignUpPage: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleRepeatPasswordVisibility = (): void => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMatch(value === repeatPassword);
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setRepeatPassword(value);
    setPasswordMatch(value === password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordMatch) {
      return;
    }

    const userData = {
      name,
      surname,
      username,
      email,
      password,
      birthDate: birthDate ? birthDate.toISOString().split("T")[0] : "", // Format date as string
    };

    try {
      const response = await fetch("http://localhost:8080/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      console.log("User created successfully:", data);

      // Redirect to login page
      window.location.href = "/login"; // Change this to your login page URL
    } catch (error) {
      console.error("Error:", error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Sign Up</h2>

        <div className="form-group">
          <div className="input-wrapper">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="surname">Your Surname</label>
            <input
              id="surname"
              type="text"
              className="form-input"
              placeholder="Enter your surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="birthDate">Birth Date</label>
            <DatePicker
              selected={birthDate}
              onChange={(date: Date | null) => setBirthDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-input"
              placeholderText="Select your birth date"
              maxDate={new Date()}
              showYearDropdown
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              showMonthDropdown
            />
          </div>
        </div>

        <div className="password-group">
          <div className="input-wrapper">
            <label htmlFor="password">Your Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        <div className="form-group password-group">
          <div className="input-wrapper">
            <label htmlFor="repeatPassword">Repeat Password</label>
            <div className="password-wrapper">
              <input
                id="repeatPassword"
                type={showRepeatPassword ? "text" : "password"}
                className="form-input"
                placeholder="Repeat your password"
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleRepeatPasswordVisibility}
                aria-label="Toggle repeat password visibility"
              >
                {showRepeatPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>

            {!passwordMatch && (
              <p className="password-error">Passwords do not match!</p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={!passwordMatch}>
          Submit
        </button>
      </form>
    </div>
  );
};
