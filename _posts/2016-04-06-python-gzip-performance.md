---
layout: post
title: "Python GZIP Peformance"
tags: [Software, Python]
summary: Improve your Python GZIP performance on text files.
---
{% include JB/setup %}

I have been testing various ways to read and write text files with GZIP in Python. There were a lot of uninteresting results, but there were two I thought were worth sharing.

### Writing GZIP files

If you have a big list of strings to write to a file, you might be tempted to do:

{% highlight python %}
f = gzip.open(out_path, 'wb')
for line in lines:
    f.write(line)
f.close()
{% endhighlight %}

But, it turns out that it's (10-20%) faster to do:

{% highlight python %}
f = gzip.open(out_path, 'wb')
try:
    f.writelines(lines)
finally:
    f.close()
{% endhighlight %}

### Reading GZIP files

If you have a big GZIP file to read (text, not binary), you might be temped to read it like:

{% highlight python %}
import gzip
f = gzip.open(in_path, 'rb')
for line in f.readlines():
    # do stuff
f.close()
{% endhighlight %}

But it turns out it can be up to 3 times faster to read it like:

{% highlight python %}
import gzip
import io
gz = gzip.open(in_path, 'rb')
f = io.BufferedReader(gz)
     for line in f.readlines():
         # do stuff
gz.close()
{% endhighlight %}
