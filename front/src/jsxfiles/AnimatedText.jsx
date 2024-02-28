import React from "react";

class AnimatedText extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            const text = document.getElementById("text");
            text.classList.remove("text-hidden");
            setTimeout(() => {
                text.style.opacity = "0";
            }, 3000);
        }, 1000);
    }

    render() {
        return (
            <>
                <p id="text" className="text-hidden">
                    장기하와 아이들
                </p>
                <style>{`
          .text-hidden {
            opacity: 0;
            transition: opacity 3s ease-in-out;
          }
        `}</style>
            </>
        );
    }
}

class StartPage extends React.Component {
    render() {
        return (
            <div style={{ width: "100vw", height: "100vh", position: "relative", background: "white" }}>
                {/* 기존 콘텐츠 */}
                <AnimatedText />
            </div>
        );
    }
}

export default StartPage;
