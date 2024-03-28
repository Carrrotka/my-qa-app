import { listQuestionFiles } from '../../lib/utils';

export default function handler(req, res) {
  const files = listQuestionFiles();
  res.status(200).json(files);
}