pipeline {
    agent any
	stages {
		stage('build') {
			steps {
				script {
					docker.build 'shmanager:latest'	
				}
			}
		}
		stage('deploy') {
			steps {
				sh 'docker rm -f shmanager || true'
				sh 'docker run -d --name shmanager --restart=unless-stopped shmanager:latest'
			}
		}
	}
}
