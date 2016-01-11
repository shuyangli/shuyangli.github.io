#!/usr/bin/env ruby
require 'fileutils'

PROJECT_ROOT    = `git rev-parse --show-toplevel`.strip
dest_paths      = PROJECT_ROOT.split('/')
dest_paths[-1]  = 'shuyangli.github.io'
DEST_ROOT       = dest_paths.join('/')
BUILD_DIR       = File.join(PROJECT_ROOT, "build")

p DEST_ROOT

task :deploy do

  message = nil

  cd PROJECT_ROOT do
    sh "bundle exec middleman build --clean"
    head = `git log --pretty="%h" -n1`.strip
    message = "Site updated to #{head}"
  end

  cd BUILD_DIR do
    sh "cp -r ./* #{DEST_ROOT}"
  end

  cd DEST_ROOT do
    sh "git pull --rebase"
    sh "git add ."

    if /nothing to commit/ =~ `git status`
      puts "No changes to commit."
    else
      sh "git commit -m \"#{message}\""
    end
    sh "git push"
  end

end
