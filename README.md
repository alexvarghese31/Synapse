🧠 Synapse - Stroke Risk Prediction

Engineered Synapse, a stroke risk prediction tool using Logistic Regression and SMOTE to assess patient data. The project spans the full ML pipeline 
from data cleaning and EDA to model training and validation—and features a user-friendly frontend for real-time risk assessment.

🎯 Problem Statement
Cardiovascular diseases are a leading cause of death globally, with strokes being a major contributor. Early identification of at-risk individuals is crucial for preventative care. 
This project aims to build and validate a machine learning model that can predict the likelihood of a patient having a stroke based on key health indicators and demographic data.

📊 Dataset
The model was trained on the Stroke Prediction Dataset sourced from Kaggle. This dataset contains over 5,000 anonymized patient records with 11 clinical features, including:

gender, age, avg_glucose_level, bmi

Binary health indicators like hypertension and heart_disease

Lifestyle factors like work_type and smoking_status

🚀 The Machine Learning Pipeline
This project covers the end-to-end workflow of a standard data science project.

Data Cleaning & Preprocessing:

Handled missing values, particularly in the bmi column, using mean/median imputation.

Encoded categorical features (e.g., gender, work_type) into numerical formats using one-hot encoding for model compatibility.

Exploratory Data Analysis (EDA):

Analyzed the distribution of key features to understand their characteristics.

Visualized correlations between different health indicators and the likelihood of stroke to identify important predictive factors.

Handling Class Imbalance:

The dataset is highly imbalanced, with far fewer instances of strokes. To address this, SMOTE (Synthetic Minority Over-sampling Technique) was applied to the training data to create a more balanced dataset and prevent model bias.

Model Training & Validation:

A Logistic Regression model was implemented using Scikit-learn due to its interpretability and solid baseline performance.

The model was trained on the SMOTE-balanced data and evaluated against a separate, untouched test set.

Evaluation:

Model performance was assessed using standard classification metrics, including Accuracy, Precision, Recall, F1-Score, and the ROC-AUC score to provide a comprehensive view of its predictive power
