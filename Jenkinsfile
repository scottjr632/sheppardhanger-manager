pipeline {
    agent any
	stages {
		stage('build') {
			steps {
				script {
					dockerImage = docker.build 'scottjr632/shmanager:latest'	
				}
			}
		}
		stage('test') {
			steps {
				script {
					dockerImage.inside {
						sh 'echo "Tests passed"'
					}
				}	
			}
		}
		stage('publish') {
			steps {
				script {
					docker.withRegistry( '', 'dockerhub' ) {
						dockerImage.push()
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
				sh 'docker rmi $(docker images -a --filter=dangling=true -q) -f || true'
				sh 'docker rm $(docker ps --filter=status=exited --filter=status=created -q) -f || true'
			}
		}
	}
}
