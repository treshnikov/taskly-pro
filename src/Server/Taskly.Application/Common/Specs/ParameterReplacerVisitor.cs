using System.Linq.Expressions;

namespace Taskly.Application.Common.Specs;

internal static partial class ParameterReplacer
{
	private class ParameterReplacerVisitor<TOutput> : ExpressionVisitor
	{
		private readonly ParameterExpression _source;
		private readonly Expression _target;

		public ParameterReplacerVisitor
			(ParameterExpression source, Expression target)
		{
			_source = source;
			_target = target;
		}

		internal Expression<TOutput> VisitAndConvert<T>(Expression<T> root)
		{
			return (Expression<TOutput>)VisitLambda(root);
		}

		protected override Expression VisitLambda<T>(Expression<T> node)
		{
			// Leave all parameters alone except the one we want to replace.
			var parameters = node.Parameters
				.Select(p => p == _source ? _target : p)
				.Cast<ParameterExpression>();

			return Expression.Lambda<TOutput>(Visit(node.Body), parameters);
		}

		protected override Expression VisitParameter(ParameterExpression node)
		{
			// Replace the source with the target, visit other params as usual.
			return node == _source ? _target : base.VisitParameter(node);
		}
	}
}
