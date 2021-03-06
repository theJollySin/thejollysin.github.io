---
layout: post
title: "Tools for Cleaning Up Git Repos"
tags: [Git, Software, Linux]
summary: A couple of useful tools for doing the Spring Cleaning on your old Git repos.
---
{% include JB/setup %}

Whether you have been maintaining the same project for years or just jumped onto something new, you should occassionally tidy up your repos. This doesn't have to happen often, say once a year. Do it in Spring and call it Spring Cleaning.

Below are a couple scripts to help you find the cob webs and dust bunnies in your repos.


### Which files haven't been edited in years?

A good place to start on your spring cleaning is to find all the files in your repos that haven't been edited in years. Sure, some of these will just be static resources. But the shell script below will also turn up any unused and forgotten files you might have lying around.

(If you aren't running Linux / Bash, the Git commands in this script will still work fine.)

**git_lonliest_files.sh**:

```shell
#!/bin/bash

#############################################################
#  Find the loneliest files in your Git repo.               #
#                                                           #
#  i.e. Sort all the files in a local Git repo by the date  #
#       of their last commit.                               #
#                                                           #
#  WARNING: This script will be slow for large repos.       #
#############################################################

# set file paths
TMP='all_the_lonely_files.tmp'
OUT='lonely_files.txt'
rm -f "${TMP}"

# loop through all the files in the repo
# and get the date for their last commit
for f in `git ls-tree --full-tree -r HEAD | awk '{print $(NF)}'`; do
  echo `git log -1 --format=%cd --date=short ${f}` "${f}" >> "${TMP}"
done

# uniquely sort the results by commit date
grep -v '^#' "${TMP}" | sort -u > "${OUT}"
rm -f "${TMP}"
```


### What are the biggest files in your repo?

Git keeps a complete history of all the files ever committed and all the changes to those files. So if you want to find the largest files in your repo, you have to search through the entire history of your repo. Luckily, Git gives us the power to do that pretty easily.

**git_largest_files.sh**:

```shell
#!/bin/bash

#############################################################
#  Find the largest files in your Git repo.                 #
#                                                           #
#  i.e. Sort all the files in a local Git repo by their     #
#       file size at any point in your repos history.       #
#       (Even deleted files take up space in your repo.)    #
#                                                           #
#  To remove a file from the history of your repo, do:      #
#                                                           #
#  git filter-branch --force --index-filter \               #
#      'git rm --cached --ignore-unmatch thing.bin' \       #
#      --prune-empty --tag-name-filter cat -- --all         #
#  git push -f                                              #
#                                                           #
#  WARNING: This script will be slow for large/old repos.   #
#############################################################

# set file paths
TMP='big_files.tmp'
OUT='largest_files.txt'
rm -f "${TMP}"

# loop through all past commits and grab file sizes
for commit in $(git rev-list --all); do
  git ls-tree -r --long "${commit}" | \
    awk '{print $(NF-1) "\t" $(NF)}' >> "${TMP}"
done

# uniquely sort the results by file size
sort -u --numeric-sort --reverse "${TMP}" > "${OUT}"
rm -f "${TMP}"

```

Did someone commit a 100MB data file and then quickly `git rm` it, thinking no one would notice? Well, you just noticed, and now you can filter it out of your history so it stops slowing you down. For a quick summary on how to totally remove files from your history, check [here](https://dalibornasevic.com/posts/2-permanently-remove-files-and-folders-from-git-repo).


### Which branches haven't been touched in years?

Branches are a great tool. But sometimes people create them and just forget about them. This isn't usually a big problem. But it sometimes means that important work is lost forever in branches that were never merged. And it can become impossible to look through all your branches if you need to. The little shell script below is a good starting point for branch cleanup.

**git_lonliest_branches.sh**:

```shell
#!/bin/bash

#############################################################
#  Find the loneliest branches in your Git repo.            #
#                                                           #
#  i.e. Sort all the branches in a local Git repo by the    #
#       date of their last commit, and show the commiter.   #
#                                                           #
#  WARNING: This script will be slow for large repos.       #
#############################################################

# set file paths
OUT='lonely_branches.txt'

# bring your local repo up to date
git fetch --all

# prune all the origin-deleted branches locally
git fetch --prune

# find all branches and sort them by age and commiter
for branch in `git branch -r | grep -v HEAD`;do echo -e `git show --format="%cd, %an," --date=format:'%Y-%m-%d' $branch | head -n 1` \\t$branch; done |    sort -r | sed 's/origin\///g' | sed 's/\t//g' | sort -u > ${OUT}
```
