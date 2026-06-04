pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *') // Automatically poll for changes in the Git repository every 2 minutes
    }

    stages {
        stage('Setup Environment') {
            steps {
                echo 'Setting up Python Virtual Environment...'
                bat '''
                    if not exist venv (
                        python -m venv venv
                    )
                    call venv\\Scripts\\activate
                    python -m pip install --upgrade pip
                    pip install -r requirements.txt
                    pip install flake8 pyinstaller
                '''
            }
        }

        stage('Lint Code') {
            steps {
                echo 'Running syntax and code quality checks (flake8)...'
                bat '''
                    call venv\\Scripts\\activate
                    flake8 --exclude=venv,"wordle github" --ignore=E,W,F401,F403,F405,F824,F841 .
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running automated unit tests...'
                bat '''
                    call venv\\Scripts\\activate
                    python -m unittest discover -s tests
                '''
            }
        }

        stage('Build Executable') {
            steps {
                echo 'Packaging tkinter application into a standalone executable...'
                bat '''
                    call venv\\Scripts\\activate
                    pyinstaller --clean --noconsole --onefile --icon=Wordle_2021_Icon.ico frontend.py
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying packaged application and required resource assets...'
                bat '''
                    if not exist C:\\WordleAppProduction (
                        mkdir C:\\WordleAppProduction
                    )
                    copy /Y dist\\frontend.exe C:\\WordleAppProduction\\
                    copy /Y Wordle_2021_Icon.ico C:\\WordleAppProduction\\
                    copy /Y dictionary_of_words.json C:\\WordleAppProduction\\
                    copy /Y geometry.csv C:\\WordleAppProduction\\
                    
                    :: Copy word lists
                    copy /Y "easy_*letter words.txt" C:\\WordleAppProduction\\
                    copy /Y "medium_*letter words.txt" C:\\WordleAppProduction\\
                    copy /Y "hard_*letter words.txt" C:\\WordleAppProduction\\
                    
                    :: Initialize games_won.txt if it does not exist
                    if not exist C:\\WordleAppProduction\\games_won.txt (
                        echo 0 > C:\\WordleAppProduction\\games_won.txt
                    )
                '''
            }
        }

        stage('Monitor') {
            steps {
                echo 'Running health check and resource monitoring on deployment...'
                bat '''
                    call venv\\Scripts\\activate
                    python monitor.py C:\\WordleAppProduction
                    copy /Y C:\\WordleAppProduction\\monitoring_report.json .
                '''
            }
        }
    }

    post {
        always {
            echo 'Archiving monitoring report...'
            archiveArtifacts artifacts: 'monitoring_report.json', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully. Archiving build executable...'
            archiveArtifacts artifacts: 'dist/frontend.exe', allowEmptyArchive: true
        }
    }
}
