from django.urls import path
from .views import WhatsappWebhookView, ConversationViewSet

urlpatterns = [
    path('webhook/', WhatsappWebhookView.as_view(), name='webhook'), # must be POST req
    path('conversations/<uuid:conversation_id>', ConversationViewSet.as_view({'get': 'retrieve'}))
]