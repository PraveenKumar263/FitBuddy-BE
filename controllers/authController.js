// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUNDS, SECRET_KEY, EMAIL_ID, FRONTEND_URL } = require('../utils/config');
const transporter = require('../utils/emailSender');
const randomstring = require('randomstring');

const authController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // Generate activation token and expiry
            const activationToken = randomstring.generate(20);
            const activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day

            // Create and save new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                activationToken,
                activationTokenExpiry,
                role
            });
            await newUser.save();

            // Activation link
            const activateLink = `${FRONTEND_URL}/activate?token=${activationToken}`;

            // Send activation email
            const mailOptions = {
                from: EMAIL_ID,
                to: email,
                subject: 'Activate Account',
                text: `Please use the following link to activate your account: ${activateLink}`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending activation email.', error: error });
                }
                return res.status(201).json({ message: 'Account created successfully. Please activate your account, check your email.' });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    activate: async (req, res) => {
        try {
            const { token } = req.body;

            // Find user by activation token
            let user = await User.findOne({
                activationToken: token,
                activationTokenExpiry: { $gt: Date.now() }
            });

            if (!user) {
                user = await User.findOne({
                    activationToken: token,
                });

                if (!user) return res.status(400).json({ message: 'Expired or invalid activation link' });

                const email = user.email;

                // Generate activation token and expiry
                const activationToken = randomstring.generate(20);
                const activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day

                // Activation link
                const activateLink = `${FRONTEND_URL}/activate?token=${activationToken}`;

                // Update activation token
                await User.updateOne(
                    { email },
                    { $set: { activationToken, activationTokenExpiry } }
                );

                // Send activation email
                const mailOptions = {
                    from: EMAIL_ID,
                    to: email,
                    subject: 'Activate Account',
                    text: `Please use the following link to activate your account: ${activateLink}`
                };

                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error sending activation email', error: error });
                    }
                    return res.status(400).json({ message: 'Activation link has expired. A new link will be sent to your email' });
                });
            }

            // Activate account and clear token
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        isActive: true,
                        activationToken: "",
                        activationTokenExpiry: null
                    }
                }
            );
            return res.json({message: 'Account activated'});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Account not found or invalid credentials' });
            }

            // Check if account is activated
            if (!user.isActive) {
                // Generate activation token and expiry
                const activationToken = randomstring.generate(20);
                const activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day

                // Activation link
                const activateLink = `${FRONTEND_URL}/activate?token=${activationToken}`;

                // Update activation token
                await User.updateOne(
                    { email },
                    { $set: { activationToken, activationTokenExpiry } }
                );

                // Send activation email
                const mailOptions = {
                    from: EMAIL_ID,
                    to: email,
                    subject: 'Activate Account',
                    text: `Please use the following link to activate your account: ${activateLink}`
                };

                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error sending activation email', error: error });
                    }
                    return res.status(400).json({ message: 'Account has not been activated. A new link will be sent to your email' });
                });
                return res.status(400).json({ message: 'Account has not been activated. A new link will be sent to your email' });
            }

            // Compare password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                SECRET_KEY, { expiresIn: '1h' }
            );

            // store the token in the cookie
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });

            return res.json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    forgot: async (req, res) => {
        try {
            const { email } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'An email will be sent' });
            }

            // Generate reset link and expiry timestamp
            const resetToken = randomstring.generate(20);
            const expiryTimeStamp = Date.now() + 60 * 60 * 1000; // 1 hour

            // Store reset token and expiry timestamp
            await User.updateOne(
                { email },
                { $set: { resetToken, resetTokenExpiry: expiryTimeStamp } }
            );

            // Create reset link
            const resetLink = `${FRONTEND_URL}/resetPassword?token=${resetToken}&expires=${expiryTimeStamp}`;

            // Send reset link via email
            const mailOptions = {
                from: EMAIL_ID,
                to: user.email,
                subject: 'Reset Password',
                text: `Please use the following link to reset your password: ${resetLink}`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email', error });
                }
                return res.json({ message: 'An email will be sent' });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    reset: async (req, res) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            // Verify reset token and expiry
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Reset link has expired or is invalid' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

            // Update password and clear reset token
            await User.updateOne(
                { resetToken: token },
                { $set: { password: hashedPassword, resetToken: null, resetTokenExpiry: null } }
            );

            return res.json({ message: 'Password reset successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token').json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    me: async (req, res) => {
        try {
            // get the user id from the request object
            const userId = req.userId;

            // get the user details from the database
            const user = await User.findById(userId).select('firstName lastName email role -_id');
 
            return res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },
};

module.exports = authController;
