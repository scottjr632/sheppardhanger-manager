pipeline {
	environement {
		registry = "scottjr632/shmanager"
	}
	stages {
		stage('build') {
			steps {
				docker.build registry + ":$BUILD_NUMBER"	
			}
		}
	}
}
