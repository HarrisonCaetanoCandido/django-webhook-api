from django.db import models

class ConversationModel(models.Model):
    conversation_id = models.CharField(primary_key=True, max_length=36, unique=True)

    # state restriction: OPEN or CLOSED
    state = models.CharField(
        max_length=6,
        choices=[
            ('OPEN', 'Open'), 
            ('CLOSED', 'Closed'),
            ],
        default='OPEN'
        ) 
    
class MessageModel(models.Model): 
    event_type = models.CharField(max_length=17)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    msg_id = models.CharField(primary_key=True, max_length=36, unique=True)
    content = models.TextField()
    direction = models.CharField(
        max_length=8,
        choices=[
            ('SENT', 'Sent'),
            ('RECEIVED', 'Received')
            ]
        )
    
    # FK table must be the Conversation associated
    conversation = models.ForeignKey(
        ConversationModel,
        on_delete=models.CASCADE,
        related_name='messages',
        to_field='conversation_id'
    )
    

    