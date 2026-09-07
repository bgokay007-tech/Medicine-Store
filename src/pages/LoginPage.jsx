import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.svg';
import pill1x from '../assets/images/pill-w1x.png';
import pill2x from '../assets/images/pill-w2x.png';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    return (
        <main className="login-page">
            <div className="login-container">
                <NavLink to="/login" className="login-brand" aria-label="E-Pharmacy">
                    <img src={logo} alt="" width="44" height="44" />
                    <span>E-Pharmacy</span>
                </NavLink>
                <div className="login-hero-row">
                    <section className="login-hero">
                        <h1>
                            Your medication, delivered Say goodbye to all
                            <span> your healthcare </span>
                            worries with us
                        </h1>
                        <picture className="login-pill">
                            <source srcSet={`${pill2x} 2x`} />
                            <img src={pill1x} alt="" width="175" height="175" />
                        </picture>
                    </section>
                    <LoginForm />
                </div>
            </div>
            <div className="login-decor" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>
        </main>
    );
}
