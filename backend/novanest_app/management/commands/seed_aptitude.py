from django.core.management.base import BaseCommand
from novanest_app.models import MockTest, Question

class Command(BaseCommand):
    help = 'Seed the database with 25 aptitude questions under a MockTest named "Aptitude Test"'

    QUESTIONS = [
        {
            'text': 'If x + y = 10 and x - y = 2, what is xy?',
            'options': ['24', '18', '21', '20'],
            'correct': 3
        },
        {
            'text': 'A train covers 240 km at a uniform speed. If its speed had been 10 km/h more, it would have taken 2 hours less. Find the original speed.',
            'options': ['40', '30', '50', '60'],
            'correct': 0
        },
        {
            'text': 'If 5 machines take 5 minutes to make 5 widgets, how long would 100 machines take to make 100 widgets?',
            'options': ['5 minutes', '100 minutes', '20 minutes', '50 minutes'],
            'correct': 0
        },
        {
            'text': 'If the ratio of two numbers is 3:4 and their HCF is 2, which of the following could be the numbers?',
            'options': ['6 and 8', '9 and 12', '3 and 4', '12 and 16'],
            'correct': 0
        },
        {
            'text': 'What is the next number in the sequence: 2, 6, 12, 20, ? ',
            'options': ['30', '24', '28', '26'],
            'correct': 2
        },
        {
            'text': 'If 7x = 5y and x + y = 48, find x and y.',
            'options': ['35 and 13', '30 and 18', '28 and 20', '32 and 16'],
            'correct': 0
        },
        {
            'text': 'In a class of 40 students, 25 like football and 20 like cricket. If 10 like both, how many like neither?',
            'options': ['5', '15', '10', '0'],
            'correct': 0
        },
        {
            'text': 'Find the value of 3^4 * 3^3.',
            'options': ['3^7', '3^12', '3^1', '3^6'],
            'correct': 0
        },
        {
            'text': 'If a:b = 2:3 and b:c = 4:5, find a:c.',
            'options': ['8:15', '6:15', '2:5', '8:5'],
            'correct': 0
        },
        {
            'text': 'A sum of money doubles itself in 5 years at simple interest. What is the rate of interest?',
            'options': ['20%', '25%', '15%', '10%'],
            'correct': 3
        },
        {
            'text': 'If the circumference of a circle is 44 cm, what is its radius? (use π=22/7)',
            'options': ['7 cm', '14 cm', '11 cm', '3.5 cm'],
            'correct': 0
        },
        {
            'text': 'If 12 men can finish a work in 8 days, how many men are needed to finish the same work in 6 days?',
            'options': ['16', '18', '14', '12'],
            'correct': 0
        },
        {
            'text': 'If the product of two consecutive integers is 272, find the integers.',
            'options': ['16 and 17', '15 and 16', '17 and 18', '14 and 15'],
            'correct': 0
        },
        {
            'text': 'If the average of 5 numbers is 20, and four of them are 18, 22, 20 and 16, what is the fifth?',
            'options': ['24', '20', '30', '18'],
            'correct': 0
        },
        {
            'text': 'Two pipes A and B can fill a tank in 10 and 15 hours respectively. If both are opened together, how long to fill the tank?',
            'options': ['6 hours', '6.67 hours', '8 hours', '9 hours'],
            'correct': 1
        },
        {
            'text': 'If the ratio of incomes of A and B is 5:7 and their expenditures are in ratio 3:4, who saves more?',
            'options': ['A', 'B', 'Both same', 'Cannot determine'],
            'correct': 1
        },
        {
            'text': 'Find the simple interest on ₹2000 at 5% per annum for 3 years.',
            'options': ['₹300', '₹200', '₹350', '₹250'],
            'correct': 0
        },
        {
            'text': 'If log10(1000) = x, what is x?',
            'options': ['2', '3', '4', '1'],
            'correct': 1
        },
        {
            'text': 'If a number is increased by 20% and then decreased by 20%, the final value is:',
            'options': ['Same as original', '4% less', '96% of original', '104% of original'],
            'correct': 2
        },
        {
            'text': 'The ratio of boys to girls in a class is 3:2. If there are 30 students, how many boys?',
            'options': ['18', '12', '15', '20'],
            'correct': 0
        },
        {
            'text': 'If 8 is divided into two parts such that one part is twice the other, the parts are?',
            'options': ['2.67 and 5.33', '2 and 6', '3 and 5', '4 and 4'],
            'correct': 2
        },
        {
            'text': 'If a is directly proportional to b and a=10 when b=5, find a when b=8.',
            'options': ['16', '10', '18', '8'],
            'correct': 0
        },
        {
            'text': 'If the angles of a triangle are in ratio 2:3:4, find the largest angle.',
            'options': ['80°', '100°', '90°', '120°'],
            'correct': 1
        },
        {
            'text': 'What is 15% of 200?',
            'options': ['30', '20', '25', '15'],
            'correct': 0
        },
        {
            'text': 'If 3 workers take 12 days, how many days will 6 workers take, assuming same efficiency?',
            'options': ['6 days', '9 days', '12 days', '4 days'],
            'correct': 0
        }
    ]

    def handle(self, *args, **options):
        test, created = MockTest.objects.get_or_create(title='Aptitude Test', defaults={'description': 'Auto-seeded aptitude questions.'})
        created_count = 0
        for q in self.QUESTIONS:
            obj, c = Question.objects.get_or_create(
                test=test,
                text=q['text'],
                defaults={'options': q['options'], 'correct_answer': q['correct'], 'marks': 1.0}
            )
            if c:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded Aptitude Test with {created_count} new questions (test id={test.id})."))
