from random import randint
from datetime import datetime
from django.shortcuts import render
from blog.models import Post
from ujson import dumps as uj_dumps
from django.http import HttpResponse
from users.forms import UserRegisterForm


# test only request routing fundamentals
def test_plaintext(request):
    return HttpResponse("Hello, World!", content_type="text/plain")

# test json serialization performance
def test_json(request):
    response = {
        "message": "Hello, World!"
    }
    return HttpResponse(uj_dumps(response), content_type="application/json")
  
# test single database query performance over ORM
def test_db(request):
    post = uj_dumps({'id' : 1, 'title' : Post.objects.get(id=1).title})
    return HttpResponse(post, content_type="application/json")

# test database update performance
def test_update(request):
    post = Post.objects.get(id=1)
    post.title = 'Blog Post ' + str(randint(10000, 99999))
    post.content = randint(10000, 99999)
    post.save()
    return HttpResponse("success", content_type="text/plain")

# test server side template engine performance
def test_template(request):
    context = {
        'posts': Post.objects.filter(id=1)
    }
    return render(request, 'blog/home.html', context)

# test post handling and form validation performance
def test_post(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            return HttpResponse("success", content_type="text/plain")
    