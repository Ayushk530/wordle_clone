pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/Ayushk530/wordle_clone.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t wordle-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f wordle-container || true'
                sh 'docker run -d --name wordle-container wordle-app'
            }
        }
    }
}
