/** @jsx h */
import { h } from "preact";

const Homepage = () => {
    return (
        <div className="homepage">
            <div className="bg-primary">
                <div className="hero">
                    <div className="hero-text">
                        <h2 className="text-bold text-secondary">
                            Make your ideas <br />
                            happen
                        </h2>
                        <p className="text-secondary subtitle">
                            Remy Ho, web developer for hire
                        </p>
                        <button>Meet with me</button>
                        <button>Contact me</button>
                    </div>
                    <div className="hero-image">
                        <div className="img"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
