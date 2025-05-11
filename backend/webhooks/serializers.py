from rest_framework import serializers
from .models import ConversationModel, MessageModel
from uuid import UUID

"""
Serializers: Allow complex data such as querysets and model instances to be converted to python
datatypes, easily rendered into JSON and other content types

https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
"""

class MessageSerializer(serializers.ModelSerializer):
    # it forces DRF to convert strings to an ConversationModel, 
    # useful especifically in validate_conversation
    conversation = serializers.PrimaryKeyRelatedField(queryset=ConversationModel.objects.all())

    class Meta:
        model = MessageModel
        fields = '__all__'
        
    def create(self, validated_data):
        """
        overload to grantee that the msg_id is saved 
        """
        return MessageModel.objects.create(**validated_data)
    
    def validate_conversation(self, conversation):
        """
        check if the conversation is stil OPEN
        """
        if conversation.state == 'CLOSED':
            raise serializers.ValidationError("Could not add messages to a closed conversation")
        return conversation
    
    def validate_direction(self, direction):
        """
        check if the direction is either SENT or RECEIVED
        """
        if direction not in ['SENT', 'RECEIVED']:
            raise serializers.ValidationError("State must be either 'SENT' or 'RECEIVED'")
        return direction
    
class ConversationSerializer(serializers.ModelSerializer):
    # defines one to many relationship https://www.django-rest-framework.org/api-guide/relations/
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ConversationModel
        fields = '__all__'
    
    def create(self, validated_data):
        return ConversationModel.objects.create(**validated_data)
    
    def validate_state(self, state):
        if state is None:
            return 'OPEN'  
        
        if state not in ['OPEN', 'CLOSED']:
            raise serializers.ValidationError("State must be either 'OPEN' or 'CLOSED'")
        
        if self.instance and state == 'CLOSED' and self.instance.state == 'CLOSED':
            raise serializers.ValidationError("Conversation is already closed")
        
        return state
    
    def validate_conversation_id(self, conversation_id):
        # check if the conversation_id is a valid UUID
        try:
            UUID(conversation_id) 
        except ValueError:
            raise serializers.ValidationError("Invalid conversation ID format")
        return conversation_id

