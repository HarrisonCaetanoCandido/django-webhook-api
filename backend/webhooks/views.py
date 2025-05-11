from .models import MessageModel, ConversationModel
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import MessageSerializer, ConversationSerializer

# only GET methods are allowed to this view


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ConversationModel.objects.all()
    serializer_class = ConversationSerializer
    lookup_field = 'conversation_id'


"""
saving instances: https://www.django-rest-framework.org/api-guide/serializers/#saving-instances
validating instances: https://www.django-rest-framework.org/api-guide/serializers/#validation

APIView: is useful to explain methods
"""


class WhatsappWebhookView(APIView):
    def post(self, req):
        event_type = req.data.get('type')
        timestamp = req.data.get('timestamp')
        data = req.data.get('data', {})

        if event_type == 'NEW_CONVERSATION':
            serializer_class = ConversationSerializer(
                 data={
                     'conversation_id': data.get('id'),
                }
            )

            # runs all validation methods
            if serializer_class.is_valid():  # avoids 500 HTTP codes
                serializer_class.save()
                return Response({"status": "Conversation initialized"}, status=201)
            
            # must be bad request
            return Response(serializer_class.errors, status=400)

        if event_type == 'NEW_MESSAGE':
            serializer_class = MessageSerializer(
                data={
                    'event_type': event_type,  # are these useful?
                    'timestamp': timestamp,
                    'msg_id': data.get('id'),
                    'content': data.get('content'),
                    'direction': data.get('direction'),
                    'conversation': data.get('conversation_id'),
                }
            )

            if serializer_class.is_valid():  # runs all validators
                serializer_class.save()
                return Response({"status": "New message added to a conversation"}, status=201)

            return Response(serializer_class.errors, status=400)

        if event_type == 'CLOSE_CONVERSATION':
            try:
                # certify if the conversation really exists
                convo = ConversationModel.objects.get(pk=data.get('id'))
            except ConversationModel.DoesNotExist as e:
                return Response({"error": str(e)}, status=404)  # resource not found

            # we need to instantiate a serializer object
            serializer_class = ConversationSerializer(
                convo,
                data = {"state": "CLOSED"},
                partial=True # it means: update just some fields
            )

            if serializer_class.is_valid():
                serializer_class.save()
                return Response({"status": "Conversation closed"}, status=200)
            
            """
            unprocessable entity, maybe its clients fault, 
            such as trying to close a CLOSED message
            """
            return Response(serializer_class.errors, status=422)


        # bad request
        return Response({"error": "Invalid event type"}, status=400)
