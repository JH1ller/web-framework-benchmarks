from django.urls import path
from . import views

urlpatterns = [
    path('plaintext/', views.test_plaintext, name='test-plaintext'),
    path('json/', views.test_json, name='test-json'),
    path('db/', views.test_db, name='test-db'),
    path('update/', views.test_update, name='test-update'),
    path('template/', views.test_template, name='test-template'),
    path('post/', views.test_post, name='test-post'),
]