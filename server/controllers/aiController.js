import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const predictTimeline = async (req, res) => {
    try {
        const { tasks, projectDescription } = req.body;

        console.log('[predictTimeline] Request received');
        console.log('[predictTimeline] API Key present:', !!process.env.OPENAI_API_KEY);
        console.log('[predictTimeline] Tasks:', tasks);

        if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
            console.warn('[predictTimeline] Invalid tasks format');
            return res.status(400).json({ error: 'Please provide a list of tasks.' });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Technical Project Manager. 
          Analyze the provided project description and list of tasks. 
          Estimate the total time required in days.
          Identify potential risks and assign a "risk factor" (Low, Medium, High).
          Provide a brief explanation for the estimate.
          
          Return the response in JSON format with the following structure:
          {
            "estimatedDays": number,
            "riskFactor": "Low" | "Medium" | "High",
            "explanation": "string",
            "completionDate": "ISO date string (assuming start date is today)"
          }`
                },
                {
                    role: "user",
                    content: `Project Description: ${projectDescription || 'N/A'}
          
          Tasks:
          ${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);

        // Calculate completion date if OpenAI didn't provide a valid one
        if (!result.completionDate) {
            const date = new Date();
            date.setDate(date.getDate() + result.estimatedDays);
            result.completionDate = date.toISOString().split('T')[0];
        }

        res.json(result);
    } catch (error) {
        console.error('[predictTimeline] Error:', error.message);

        // Fallback for Demo/Quota limits
        console.log('[predictTimeline] Returning MOCK data due to API error.');
        const mockDays = Math.floor(Math.random() * 20) + 5;
        const date = new Date();
        date.setDate(date.getDate() + mockDays);

        res.json({
            estimatedDays: mockDays,
            riskFactor: "Medium",
            explanation: "⚠️ API Quota Exceeded. This is a DEMO estimation. In a real scenario, AI would analyze your tasks for precision.",
            completionDate: date.toISOString().split('T')[0]
        });
    }
};

export const generateContractContent = async (req, res) => {
    console.log('[generateContract] Request received');
    console.log('[generateContract] Body:', req.body);
    try {
        const { clientName, projectName, scope, budget, estimatedDate } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a legal expert specializing in software development contracts.
          Draft a professional Service Agreement based on the provided details.
          The contract should include:
          1. Header with "Service Agreement".
          2. Parties involved (Vaisptech Solutions and the Client).
          3. Project Scope.
          4. Commercial terms (Budget).
          5. Timeline (Completion Date).
          6. Standard confidentiality and extensive legal terms are NOT required, keep it concise but professional.
          
          Format the output as plain text suitable for a PDF.`
                },
                {
                    role: "user",
                    content: `Client: ${clientName}
          Project: ${projectName}
          Scope: ${scope}
          Budget: $${budget}
          Est. Completion: ${estimatedDate}`
                }
            ]
        });

        res.json({ content: completion.choices[0].message.content });
    } catch (error) {
        console.error('[generateContract] Error:', error.message);

        console.log('[generateContract] Generating Template-based Contract (Fallback).');
        const { clientName, projectName, scope, budget, estimatedDate } = req.body;

        const contractText = `
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into by and between:

PROVIDER: Vaisptech Solutions, a technology agency ("Provider").
CLIENT: ${clientName} ("Client").

1. ENGAGEMENT
Provider agrees to perform the services described in the Project Scope below for the Client.

2. PROJECT NAME
${projectName}

3. SCOPE OF WORK
Provider shall deliver the following services:
${scope}

4. FINANCIAL TERMS
Total Project Budget: $${budget}
Payment Terms: 50% deposit required to commence work, with the remaining balance due upon completion/delivery.

5. TIMELINE
Estimated Completion Date: ${estimatedDate}
The Provider will make reasonable efforts to meet this deadline, subject to the Client's timely provision of necessary resources and feedback.

6. CONFIDENTIALITY
Each party shall treat all confidential information received from the other party as strictly confidential and shall not disclose such information to any third party without prior written consent.

7. INTELLECTUAL PROPERTY
Upon full payment of the Budget, Provider assigns to Client all right, title, and interest in the deliverables created specifically for Client under this Agreement.

IN WITNESS WHEREOF, the parties have caused this Agreement to be executed by their duly authorized representatives.

__________________________                  __________________________
Vaisptech Solutions                         ${clientName}
Date: ${new Date().toLocaleDateString()}                        Date: ____________________
        `.trim();

        res.json({ content: contractText });
    }
};
