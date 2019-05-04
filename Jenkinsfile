pipeline {
	agent { docker { iamge 'python:3.7.2' } }	
	stages {
		stage('build') {
			steps {
				sh 'pip install -r requirements.txt'
				sh 'npm --prefix client install'
				sh 'npm --prefix run build'
			}
		}
		stage('test') {
			steps {}
		}
		stage('deploy') {
			steps {}
		}
	}
}
