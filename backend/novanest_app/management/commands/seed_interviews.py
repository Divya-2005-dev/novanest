from django.core.management.base import BaseCommand
from novanest_app.models import MockInterview, InterviewQuestion

class Command(BaseCommand):
    help = 'Seed the database with mock interview questions'

    INTERVIEWS = [
        {
            'title': 'General Technical Interview',
            'description': 'Common technical interview questions for software development roles.',
            'questions': [
                {
                    'text': 'Tell me about yourself and your professional background.',
                    'suggested_answer': 'Provide a concise summary of your education, work experience, and key achievements. Focus on relevant skills and experiences for the role. Keep it to 1-2 minutes.'
                },
                {
                    'text': 'What is object-oriented programming (OOP) and what are its main principles?',
                    'suggested_answer': 'OOP is a programming paradigm based on objects rather than functions. Main principles: Encapsulation (bundling data and methods), Inheritance (deriving classes from parent classes), Polymorphism (same interface for different objects), and Abstraction (hiding internal details).'
                },
                {
                    'text': 'Explain the difference between SQL and NoSQL databases.',
                    'suggested_answer': 'SQL: Relational, ACID compliance, structured schema, good for complex queries. NoSQL: Non-relational, eventually consistent, flexible schema, scalable for large data, good for unstructured data. Choice depends on use case.'
                },
                {
                    'text': 'What is a REST API and what are the key principles?',
                    'suggested_answer': 'REST (Representational State Transfer) is an architectural style for web services. Key principles: Client-server architecture, Statelessness, Uniform interface, Cacheability, Layered system. Uses HTTP methods (GET, POST, PUT, DELETE) for operations on resources.'
                },
                {
                    'text': 'How do you handle exceptions and errors in your code?',
                    'suggested_answer': 'Use try-catch blocks (or try-except in Python) to handle expected errors gracefully. Log errors with context. Use custom exceptions when appropriate. Provide meaningful error messages. Fail fast and explicitly. Use assertions for debug checks.'
                },
            ]
        },
        {
            'title': 'Full-Stack Development Interview',
            'description': 'Interview questions specific to full-stack web development.',
            'questions': [
                {
                    'text': 'What is the role of HTML, CSS, and JavaScript in web development?',
                    'suggested_answer': 'HTML: Provides structure and content (markup). CSS: Styles and layouts the elements (presentation). JavaScript: Adds interactivity and dynamic behavior (functionality). Together they create the frontend layer of web applications.'
                },
                {
                    'text': 'Explain the MVC (Model-View-Controller) architecture.',
                    'suggested_answer': 'MVC separates an application into three interconnected components: Model (data and business logic), View (user interface), Controller (handles input and updates model/view). Benefits: separation of concerns, easier testing, and maintainability.'
                },
                {
                    'text': 'What is the purpose of package managers like npm or pip?',
                    'suggested_answer': 'Package managers manage project dependencies, versions, and distributions. npm (Node.js) manages JavaScript packages, pip (Python) manages Python packages. They simplify installation, updates, and dependency resolution.'
                },
                {
                    'text': 'How does authentication and authorization differ?',
                    'suggested_answer': 'Authentication: Verifies user identity (username/password, tokens). Authorization: Determines what authenticated users can do (permissions, roles). Both are critical for security.'
                },
                {
                    'text': 'What are common security vulnerabilities in web applications?',
                    'suggested_answer': 'SQL Injection: Malicious SQL code in inputs. XSS (Cross-Site Scripting): Injecting malicious scripts. CSRF (Cross-Site Request Forgery): Unauthorized actions on user\'s behalf. Use input validation, parameterized queries, and secure headers.'
                },
            ]
        },
        {
            'title': 'Problem-Solving Interview',
            'description': 'Questions focused on analytical and problem-solving skills.',
            'questions': [
                {
                    'text': 'How do you approach solving a new problem you haven\'t encountered before?',
                    'suggested_answer': 'Break it down into smaller sub-problems. Research and gather information. Brainstorm multiple solutions. Evaluate pros/cons of each. Choose the best approach. Test and iterate. Learn from the outcome.'
                },
                {
                    'text': 'Can you give an example of a complex problem you solved? What was your approach?',
                    'suggested_answer': 'Choose a real example from your experience. Explain the problem clearly. Describe your approach and tools used. Mention challenges and how you overcame them. Conclude with the result and lessons learned.'
                },
                {
                    'text': 'How do you prioritize tasks when you have multiple deadlines?',
                    'suggested_answer': 'Use techniques like Eisenhower Matrix: identify urgent vs. important. Consider dependencies and impact. Communicate with stakeholders. Break large tasks into smaller ones. Re-prioritize as needed. Balance quality and speed.'
                },
                {
                    'text': 'Tell me about a time you had to learn something quickly.',
                    'suggested_answer': 'Describe the situation, why quick learning was needed. Explain your learning strategy (documentation, tutorials, asking experts). Highlight the result. Show your adaptability and resourcefulness.'
                },
                {
                    'text': 'How do you test your code to ensure it works correctly?',
                    'suggested_answer': 'Use unit tests for individual functions. Integration tests for component interactions. Manual testing for user flows. Code review with peers. Use debugging tools. Automate where possible. Test edge cases and error scenarios.'
                },
            ]
        },
    ]

    def handle(self, *args, **options):
        created_count = 0
        for interview_data in self.INTERVIEWS:
            interview, created = MockInterview.objects.get_or_create(
                title=interview_data['title'],
                defaults={'description': interview_data['description']}
            )
            for q_data in interview_data['questions']:
                q_obj, q_created = InterviewQuestion.objects.get_or_create(
                    interview=interview,
                    text=q_data['text'],
                    defaults={'suggested_answer': q_data['suggested_answer']}
                )
                if q_created:
                    created_count += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} new interview questions."))
