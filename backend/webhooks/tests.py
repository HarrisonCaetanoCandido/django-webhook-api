from django.test import TestCase
from rest_framework.test import APIClient
from webhooks.models import ConversationModel


class WebhookTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.convo_id = "6a41b347-8d80-4ce9-84ba-7af66f369f6a"

    def test_201_from_new_convo(self):
        res = self.client.post('/webhook/',
                               {
                                   "type": "NEW_CONVERSATION",
                                   "timestamp": "2025-02-21T10:20:41.349308",
                                   "data": {"id": self.convo_id},
                               }, format='json')
        self.assertEqual(res.status_code, 201)

    def test_201_from_new_msg_to_open_convo(self):
        ConversationModel.objects.create(pk=self.convo_id)

        res = self.client.post('/webhook/',
                               {
                                   "type": "NEW_MESSAGE",
                                   "timestamp": "2025-02-21T10:20:42.349308",
                                   "data": {
                                       "id": "49108c71-4dca-4af3-9f32-61bc745926e2",
                                       "direction": "RECEIVED",
                                       "content": "Olá, tudo bem?",
                                       "conversation_id": self.convo_id
                                   }
                               },
                               format='json')
        self.assertEqual(res.status_code, 201)

        res = self.client.post('/webhook/',
                               {
                                   "type": "NEW_MESSAGE",
                                   "timestamp": "2025-02-21T10:20:44.349308",
                                   "data": {
                                       "id": "16b63b04-60de-4257-b1a1-20a5154abc6d",
                                       "direction": "SENT",
                                       "content": "Tudo ótimo e você?",
                                       "conversation_id": self.convo_id
                                   }
                               }, format='json')
        self.assertEqual(res.status_code, 201)

    def test_400_from_message_to_closed_convo(self):
        ConversationModel.objects.create(pk=self.convo_id, state="CLOSED")

        res = self.client.post('/webhook/',
                               {
                                   "type": "NEW_MESSAGE",
                                   "timestamp": "2025-02-21T10:20:42.349308",
                                   "data": {
                                       "id": "16b63b04-60de-4257-b1a1-20a5154abc6d",
                                       "direction": "RECEIVED",
                                       "content": "Testando essa mensagem para uma conversa CLOSED",
                                       "conversation_id": self.convo_id
                                   }
                               }, format='json')
        self.assertEqual(res.status_code, 400)
        self.assertIn(
            "Could not add messages to a closed conversation", str(res.content))

    def test_404_from_close_a_nonexistent_convo(self):
        res = self.client.post('/webhook/',
                               {
                                   "type": "CLOSE_CONVERSATION",
                                   "timestamp": "2025-02-21T10:20:45.349308",
                                   "data": {
                                       "id": "6a41b347-8d80-4ce9-84ba-7af66f369f6a"
                                   }
                               }, format='json')
        self.assertEqual(res.status_code, 404)

    def test_200_from_close_an_open_convo(self):
        ConversationModel.objects.create(pk=self.convo_id)

        res = self.client.post('/webhook/',
                               {
                                   "type": "CLOSE_CONVERSATION",
                                   "timestamp": "2025-02-21T10:20:45.349308",
                                   "data": {
                                           "id": "6a41b347-8d80-4ce9-84ba-7af66f369f6a"
                                   }
                               }, format='json')

        self.assertEqual(res.status_code, 200)

    def test_receive_422_from_an_already_closed_convo(self):
        ConversationModel.objects.create(pk=self.convo_id, state='CLOSED')

        res = self.client.post('/webhook/',
                               {
                                   "type": "CLOSE_CONVERSATION",
                                   "timestamp": "2025-02-21T10:20:45.349308",
                                   "data": {
                                           "id": "6a41b347-8d80-4ce9-84ba-7af66f369f6a"
                                   }
                               }, format='json')

        self.assertEqual(res.status_code, 422)
