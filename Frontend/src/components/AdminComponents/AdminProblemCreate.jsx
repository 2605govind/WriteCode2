import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, NavLink } from 'react-router';
import DarkModeToggle from '../../components/DarkModeToggle.jsx';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {axiosProblem} from '../../utils/axiosClient.js'

const problemSchema = z.object({
  problemNumber: z.string().min(1, 'Problem number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  companies: z.array(z.string()).min(1, 'At least one company is required'),
  videosUrl: z.array(z.string().url()).min(1, 'At least one valid video URL is required'),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['cpp', 'java', 'javascript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['cpp', 'java', 'javascript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminProblemCreate() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      problemNumber: '',
      tags: [],
      companies: [],
      videosUrl: [],
      startCode: [
        { language: 'cpp', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'cpp', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag
  } = useFieldArray({
    control,
    name: 'tags'
  });

  const {
    fields: companyFields,
    append: appendCompany,
    remove: removeCompany
  } = useFieldArray({
    control,
    name: 'companies'
  });

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo
  } = useFieldArray({
    control,
    name: 'videosUrl'
  });

  const onSubmit = async (data) => {
    try {
      
      await axiosProblem.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-[#E0E0E0] dark:bg-[#121212] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="bg-[#1e1e1e] py-4 px-6 flex justify-between items-center shadow-sm fixed w-full z-50">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-xl font-semibold text-orange-400">
            CodeClone
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs text-white">
                {user.fullName?.charAt(0)}
              </div>
              <span className="text-sm text-white">{user.firstName}</span>
            </div>
          )}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="text-sm px-3 py-1 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white mr-6"
            >
              Admin
            </NavLink>
          )}
          <DarkModeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-24 pb-12 px-6">
        <h1 className="text-3xl font-bold mb-6 text-[#121212] dark:text-[#E0E0E0]">Create New Problem</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-lg shadow-lg border border-[#B0B0B0] dark:border-[#444444]">
            <h2 className="text-xl font-semibold mb-4 text-[#121212] dark:text-[#E0E0E0]">Basic Information</h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Problem Number</label>
                <input
                  {...register('problemNumber')}
                  className={`w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] ${
                    errors.problemNumber ? 'border-red-500' : ''
                  }`}
                />
                {errors.problemNumber && (
                  <span className="text-red-500 text-sm mt-1">{errors.problemNumber.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Title</label>
                <input
                  {...register('title')}
                  className={`w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Description</label>
                <textarea
                  {...register('description')}
                  className={`w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] h-32 ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
                )}
              </div>

              <div className="flex gap-4">
                <div className="form-control w-1/2">
                  <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Difficulty</label>
                  <select
                    {...register('difficulty')}
                    className={`w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0] ${
                      errors.difficulty ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="form-control">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-[#444444] dark:text-[#B0B0B0]">Tags</label>
                  <button
                    type="button"
                    onClick={() => appendTag('')}
                    className="flex items-center gap-1 text-[#444444] dark:text-[#E0E0E0] hover:text-[#121212] dark:hover:text-white"
                  >
                    <FaPlus size={12} /> Add Tag
                  </button>
                </div>
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input
                      {...register(`tags.${index}`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                {errors.tags && (
                  <span className="text-red-500 text-sm mt-1">{errors.tags.message}</span>
                )}
              </div>

              {/* Companies */}
              <div className="form-control">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-[#444444] dark:text-[#B0B0B0]">Companies</label>
                  <button
                    type="button"
                    onClick={() => appendCompany('')}
                    className="flex items-center gap-1 text-[#444444] dark:text-[#E0E0E0] hover:text-[#121212] dark:hover:text-white"
                  >
                    <FaPlus size={12} /> Add Company
                  </button>
                </div>
                {companyFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input
                      {...register(`companies.${index}`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      placeholder="Enter company name"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompany(index)}
                      className="px-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                {errors.companies && (
                  <span className="text-red-500 text-sm mt-1">{errors.companies.message}</span>
                )}
              </div>

              {/* Video URLs */}
              <div className="form-control">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-[#444444] dark:text-[#B0B0B0]">Video URLs</label>
                  <button
                    type="button"
                    onClick={() => appendVideo('')}
                    className="flex items-center gap-1 text-[#444444] dark:text-[#E0E0E0] hover:text-[#121212] dark:hover:text-white"
                  >
                    <FaPlus size={12} /> Add Video URL
                  </button>
                </div>
                {videoFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input
                      {...register(`videosUrl.${index}`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      placeholder="Enter video URL"
                    />
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="px-3 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                {errors.videosUrl && (
                  <span className="text-red-500 text-sm mt-1">{errors.videosUrl.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-lg shadow-lg border border-[#B0B0B0] dark:border-[#444444]">
            <h2 className="text-xl font-semibold mb-4 text-[#121212] dark:text-[#E0E0E0]">Test Cases</h2>
            
            {/* Visible Test Cases */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[#121212] dark:text-[#E0E0E0]">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="flex items-center gap-1 text-[#444444] dark:text-[#E0E0E0] hover:text-[#121212] dark:hover:text-white border border-transparent hover:border-[#444444] px-3 py-1 rounded"
                >
                  <FaPlus size={12} /> Add Visible Case
                </button>
              </div>
              
              {visibleFields.map((field, index) => (
                <div key={field.id} className="border border-[#B0B0B0] dark:border-[#444444] p-4 rounded-lg space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Input</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.input`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Output</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.output`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      rows={2}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Explanation</label>
                    <textarea
                      {...register(`visibleTestCases.${index}.explanation`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-[#121212] dark:text-[#E0E0E0]">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="flex items-center gap-1 text-[#444444] dark:text-[#E0E0E0] hover:text-[#121212] dark:hover:text-white border border-transparent hover:border-[#444444] px-3 py-1 rounded"
                >
                  <FaPlus size={12} /> Add Hidden Case
                </button>
              </div>
              
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border border-[#B0B0B0] dark:border-[#444444] p-4 rounded-lg space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Input</label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.input`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Output</label>
                    <textarea
                      {...register(`hiddenTestCases.${index}.output`)}
                      className="w-full px-4 py-2 border border-[#B0B0B0] dark:border-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#444444] dark:bg-[#121212] dark:text-[#E0E0E0]"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Templates */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-lg shadow-lg border border-[#B0B0B0] dark:border-[#444444]">
            <h2 className="text-xl font-semibold mb-4 text-[#121212] dark:text-[#E0E0E0]">Code Templates</h2>
            
            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-medium text-[#121212] dark:text-[#E0E0E0]">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Initial Code</label>
                    <pre className="bg-[#F0F0F0] dark:bg-[#1E1E1E] p-4 rounded-lg border border-[#B0B0B0] dark:border-[#444444]">
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        className="w-full bg-transparent font-mono text-[#121212] dark:text-[#E0E0E0]"
                        rows={8}
                      />
                    </pre>
                  </div>
                  
                  <div className="form-control">
                    <label className="block mb-2 text-sm text-[#444444] dark:text-[#B0B0B0]">Reference Solution</label>
                    <pre className="bg-[#F0F0F0] dark:bg-[#1E1E1E] p-4 rounded-lg border border-[#B0B0B0] dark:border-[#444444]">
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        className="w-full bg-transparent font-mono text-[#121212] dark:text-[#E0E0E0]"
                        rows={12}
                      />
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-[#121212] hover:bg-[#444444] text-[#E0E0E0] rounded-md transition-colors duration-300 text-lg"
          >
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProblemCreate;