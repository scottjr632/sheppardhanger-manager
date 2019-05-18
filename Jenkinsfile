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
				sh 'docker run -d --name shmanager -p 5000:5000 -e DATABASE_URL=postgresql://shmanager:shmanager@localhost:5432/shmanager --net=host --restart=unless-stopped scottjr632/shmanager:latest'
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
