pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('TFG-BACKEND') {
                    sh 'docker build -t admin-backend:latest .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('TFG-FRONTEND') {
                    sh 'docker build -t admin-frontend:latest .'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose -f docker-compose.yml down || true'
                sh 'docker-compose -f docker-compose.yml up -d'
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10'
                sh 'curl -f http://localhost:5173 || exit 1'
                sh 'curl -f http://localhost:5050/health || exit 1'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed'
            sh 'docker-compose -f docker-compose.yml logs'
        }
    }
}
