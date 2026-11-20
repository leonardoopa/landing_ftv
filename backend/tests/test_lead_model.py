import unittest

from pydantic import ValidationError

from app.models.lead import Lead, LeadCreate


class LeadModelTest(unittest.TestCase):
    def test_defaults(self):
        lead = LeadCreate(name="Ana", whatsapp="11999998888")
        self.assertEqual(lead.source, "landing")
        self.assertIsNone(lead.plan)

    def test_invalid_source(self):
        with self.assertRaises(ValidationError):
            LeadCreate(name="Ana", whatsapp="11999998888", source="x")

    def test_plan_too_long(self):
        with self.assertRaises(ValidationError):
            LeadCreate(name="Ana", whatsapp="11999998888", plan="a" * 41)

    def test_quiz_with_plan(self):
        lead = LeadCreate(name="Ana", whatsapp="11999998888", source="quiz", plan="Completo")
        self.assertEqual((lead.source, lead.plan), ("quiz", "Completo"))

    def test_lead_inherits_source(self):
        lead = Lead(name="Ana", whatsapp="11999998888", source="quiz")
        self.assertEqual(lead.source, "quiz")
