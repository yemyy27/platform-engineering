# Platform Engineering - Command Reference Documentation

## Environment Setup Commands

### Xcode Command Line Tools
```bash
xcode-select -p
```

### Homebrew
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo >> /Users/kareemrufai/.zprofile
echo 'eval "$(/opt/homebrew/bin/brew shellenv zsh)"' >> /Users/kareemrufai/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv zsh)"

# Verify
brew --version
```

### Python 3.11
```bash
# Install
brew install python@3.11

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"' >> ~/.zprofile

# Add aliases
echo 'alias python3="/opt/homebrew/opt/python@3.11/bin/python3.11"' >> ~/.zprofile
echo 'alias pip3="/opt/homebrew/opt/python@3.11/bin/pip3.11"' >> ~/.zprofile
source ~/.zprofile

# Verify
python3 --version
```

### Git Configuration
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --list
```

### VS Code
```bash
# Verify code command works
code --version

# Open a folder in VS Code
code .
```

### Docker
```bash
# Verify installation
docker --version

# Test Docker is running
docker run hello-world
```

### Google Cloud CLI
```bash
# Install
brew install --cask google-cloud-sdk

# Set Python for gcloud
echo 'export CLOUDSDK_PYTHON="/opt/homebrew/opt/python@3.11/bin/python3.11"' >> ~/.zprofile
source ~/.zprofile

# Initialize and login
gcloud init

# Set active project
gcloud config set project platform-eng-kareem

# Verify
gcloud --version
gcloud config list
```

### Node.js
```bash
brew install node
node --version
```

### Gemini API Key
```bash
# Enable Gemini API on GCP project
gcloud services enable generativelanguage.googleapis.com --project=platform-eng-kareem

# Store API key
echo 'export GOOGLE_API_KEY="your-key-here"' >> ~/.zprofile
source ~/.zprofile

# Verify
echo $GOOGLE_API_KEY
```

## Project Setup Commands

### Create Project Structure
```bash
mkdir ~/platform-engineering
cd ~/platform-engineering
mkdir week1 week2 week3 week4 week5 week6 week7
code ~/platform-engineering
```

### Copy Curriculum PDF
```bash
cp "/Users/kareemrufai/Documents/Claude/Projects/The Platform Engineering/The Platform Engineer's Complete Learning Path for the AI Era.pdf" ~/platform-engineering/
```

## Git & GitHub Commands

### SSH Key Setup
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "kareem.rufai27@gmail.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to add to GitHub
cat ~/.ssh/id_ed25519.pub

# Test connection
ssh -T git@github.com
```

### Repository Commands
```bash
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "your message here"

# Rename branch to main
git branch -M main

# Add remote origin
git remote add origin git@github.com:yemyy27/platform-engineering.git

# Push to GitHub
git push -u origin main

# Regular push after first time
git push origin main
```

### Security
```bash
# Prevent zprofile from being pushed to GitHub
echo ".zprofile" >> ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

## Week 1 Commands

### Create Learning Journal
```bash
cd ~/platform-engineering/week1
touch genai-foundations.md
code .
```

## Daily Workflow Commands
```bash
# Start of every session
cd ~/platform-engineering
git pull origin main

# End of every session
git add .
git commit -m "describe what you did today"
git push origin main
```