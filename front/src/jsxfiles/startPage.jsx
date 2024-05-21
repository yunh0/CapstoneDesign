import React, { Component } from "react";
import * as THREE from "three";
import { Link } from 'react-router-dom';
import '../cssfiles/startPage.css';

class StartPage extends Component {
    constructor(props) {
        super(props);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.geometry = new THREE.SphereGeometry(1, 32, 32);
        this.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // MeshPhongMaterial 사용
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.initThree();
        this.rotateElement();
    }

    initThree() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff); // 배경색을 흰색으로 설정
        this.ref.current.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        this.scene.add(this.mesh);
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }

    rotateElement() {
        let startTime;
        const duration = 1000; // 회전에 걸리는 시간 (10초)
        const startAngle = 0; // 시작 각도
        const endAngle = 360; // 종료 각도

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            const angle = startAngle + ((endAngle - startAngle) * progress) / duration;
            this.mesh.rotation.z = THREE.MathUtils.degToRad(angle);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

    render() {
        return (
            <div className="start-page-container">
                <div className="start-page-circle1" ref={this.ref}></div>
                <div className="project-name-container">
                    <div className="project-name">Insurance Counseling</div>
                    <div className="auth-buttons-container">
                        <Link to ='/rlogin' className="login-button">Log in</Link>
                        <Link to ='/rsignup' className="signup-button">Sign up</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default StartPage;
