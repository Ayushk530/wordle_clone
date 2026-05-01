pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Ayushk530/wordle_clone.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t wordle-app .'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker rm -f wordle-container || exit 0'
                bat 'docker run -d --name wordle-container wordle-app'
            }
        }
    }
}
