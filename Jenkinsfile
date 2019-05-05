pipeline {
	agent any
	stages {

		stage('build') {
			steps {
				script {
					docker.build 'shmanager:$BUILD_NUMBER'	
				}
			}
		}
	}
}
