pipeline {
	agent any
	stages {
		stage('build') {
			steps {
				docker.build 'shmanager:$BUILD_NUMBER'	
			}
		}
	}
}
