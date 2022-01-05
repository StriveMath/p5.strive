# 🌸 Welcome! 🌺

Thanks for your interest in contributing to p5.strive! Our community values contributions of all forms and seeks to expand the meaning of the word "contributor" as far and wide as possible.

Please be sure to review our [community statement and code of conduct](https://github.com/strivemath/p5.strive/blob/main/CODE_OF_CONDUCT.md). These things are very important to us.

# GitHub Issue Flow

* Known bugs and intended new features are tracked using [GitHub issues](https://github.com/strivemath/p5.strive/issues).

* If you'd like to start working on an existing issue, comment on the issue that you plan to work on it so other contributors know it's being handled and can offer help.

* Once you have completed your work on this issue, submit a pull request (PR) against the p5.strive main branch. In the description field of the PR, include "resolves #XXXX" tagging the issue you are fixing. If the PR addresses the issue but doesn't completely resolve it (ie the issue should remain open after your PR is merged), write "addresses #XXXX".

* If you discover a bug or have an idea for a new feature you'd like to add, begin by submitting an issue. Please do not simply submit a pull request containing the fix or new feature without making an issue first, we will probably not be able to accept it. Once you have gotten some feedback on the issue and a go ahead to address it, you can follow the process above to contribute the fix or feature.

# Development Process

We know the development process can be a little tricky at first. You're not alone, it's confusing for everyone at the beginning. The steps below walk you through the setup process. If you have questions, you can post an [issue](https://github.com/strivemath/p5.strive/issues) that describes the place you are stuck, and we'll do our best to help.

1. Install [Python](https://python.org/).

2. [Fork](https://help.github.com/articles/fork-a-repo) the [p5.strive repository](https://github.com/strivemath/p5.strive) into your own GitHub account.

3. [Clone](https://help.github.com/articles/cloning-a-repository/) your new fork of the repository from GitHub onto your local computer.

   ```
   $ git clone https://github.com/YOUR_USERNAME/p5.strive.git
   ```

4. Make some changes locally to the codebase, build, and run a local  web server. You can view the example sketch in your browser at `localhost:8000/example/`.

   ```
   $ cd p5.strive
   $ python build.py
   $ python -m http.server
   ```

5. [Commit](https://help.github.com/articles/github-glossary/#commit) your changes with Git.

   ```
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

6. [Push](https://help.github.com/articles/github-glossary/#push) your new changes to your fork on GitHub.

   ```
   $ git push
   ```

7. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).
