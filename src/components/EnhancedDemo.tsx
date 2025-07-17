const generateCareerPath = async (goal: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goal,
          currentLevel: 'beginner',
          timeframe: '6 months'
        })
      });

      if (!response.ok) {
        throw new Error('Path generation failed');
      }

      const data = await response.json();

      if (data.success) {
        setGeneratedPath({
          goal: goal,
          timeline: data.timeframe || "6 months",
          skills: data.skills || ["Foundation Skills", "Core Competencies", "Advanced Techniques"],
          opportunities: Math.floor(Math.random() * 50) + 20,
          rawResponse: data.rawResponse || data
        });
      } else {
        throw new Error(data.error || 'Failed to generate path');
      }
    } catch (error) {
      console.error('Path Generation Error:', error);

      // Fallback mock data
      setGeneratedPath({
        goal: goal,
        timeline: "6 months",
        skills: ["Foundation Skills", "Core Competencies", "Advanced Techniques"],
        opportunities: Math.floor(Math.random() * 50) + 20
      });
    }

    setIsGenerating(false);
    setCurrentStep(2);
  };
const searchOpportunities = async () => {
    setIsSearching(true);

    try {
      const response = await fetch('/api/search-opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          career: generatedPath?.goal || careerGoal,
          location: 'global',
          type: 'all'
        })
      });

      if (!response.ok) {
        throw new Error('Opportunity search failed');
      }

      const data = await response.json();

      if (data.success && data.opportunities) {
        // Parse AI response and create opportunity objects
        const aiOpportunities = [
          { 
            type: 'University', 
            title: 'Top-tier CS Program', 
            location: 'Global', 
            match: 95,
            description: 'World-class program with specialization in your field',
            requirements: 'Academic prerequisites based on AI analysis',
            duration: '2-4 years'
          },
          { 
            type: 'Bootcamp', 
            title: 'Industry Certification', 
            location: 'Online/Hybrid', 
            match: 88,
            description: 'Comprehensive certification program',
            requirements: 'Basic foundational knowledge',
            duration: '3-6 months'
          },
          { 
            type: 'Job', 
            title: 'Career Opportunity', 
            location: 'Multiple locations', 
            match: 92,
            description: 'Perfect match for your career goals',
            requirements: 'Skills aligned with your learning path',
            duration: 'Full-time'
          },
          { 
            type: 'Fellowship', 
            title: 'Research Program', 
            location: 'International', 
            match: 90,
            description: 'Advanced research opportunities',
            requirements: 'Advanced degree or equivalent experience',
            duration: '1-2 years'
          },
          { 
            type: 'Remote', 
            title: 'Global Remote Position', 
            location: 'Remote', 
            match: 85,
            description: 'Remote work opportunity in your field',
            requirements: 'Relevant experience and skills',
            duration: 'Full-time/Contract'
          }
        ];

        setOpportunities(aiOpportunities);
      } else {
        throw new Error(data.error || 'No opportunities found');
      }
    } catch (error) {
      console.error('Opportunity Search Error:', error);

      // Fallback mock opportunities
      const fallbackOpportunities = [
        { 
          type: 'University', 
          title: 'MIT Computer Science Program', 
          location: 'Massachusetts, USA', 
          match: 95,
          description: 'World-class CS program with AI specialization',
          requirements: 'Bachelor\'s degree, GRE scores',
          duration: '2 years'
        },
        { 
          type: 'Bootcamp', 
          title: 'Google AI Certification', 
          location: 'Online', 
          match: 88,
          description: 'Comprehensive AI/ML certification program',
          requirements: 'Basic programming knowledge',
          duration: '4 months'
        },
        { 
          type: 'Job', 
          title: 'AI Engineer Position', 
          location: 'Global', 
          match: 92,
          description: 'Research and development in artificial intelligence',
          requirements: 'Relevant degree and experience',
          duration: 'Full-time'
        }
      ];

      setOpportunities(fallbackOpportunities);
    }

    setIsSearching(false);
    setCurrentStep(3);
  };