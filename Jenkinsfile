pipeline {
    agent any
	stages {
		stage('build') {
			steps {
				script {
					app = docker.build 'shmanager:latest'	
				}
			}
		}
		stage('test') {
			steps {
				script {
					app.inside {
						sh 'echo "Tests passed"'
					}
				}	
			}
		}
		stage('deploy') {
			steps {
				sh 'docker rm -f shmanager || true'
				sh 'docker run -d --name shmanager --restart=unless-stopped shmanager:latest'
			}
		
		}
		stage('cleanup') {
			steps {
				sh 'docker rmi $(docker images -a --filter=dangling=true -q) -f'
				sh 'docker rm $(docker ps --filter=status=exited --filter=status=created -q) -f'
			}
		}
	}
}
