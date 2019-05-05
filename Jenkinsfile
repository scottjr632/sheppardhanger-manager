pipeline {
	environment {
		registry = 'scottjr632/shmanager'
	}
	agent any
	stages {
		stage('build') {
			steps {
				docker.build registry + ':$BUILD_NUMBER'	
			}
		}
	}
}
