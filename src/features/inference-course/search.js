import { courseLessons } from './data.js';
const documents = import.meta.glob('./content/*.md', { query:'?raw', import:'default', eager:true });
export function searchCourse(query) {
  const term = query.trim().toLowerCase();
  return term ? courseLessons.filter(lesson => `${lesson.title} ${lesson.description} ${documents[`./content/${lesson.id}.md`]} ${lesson.quiz.question} ${lesson.quiz.answer}`.toLowerCase().includes(term)) : [];
}
