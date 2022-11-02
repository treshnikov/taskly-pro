using System.Linq.Expressions;

namespace Taskly.Application.Common.Specs;

internal static partial class ParameterReplacer
{
	public static Expression<TOutput> Replace<TInput, TOutput>(
		Expression<TInput> expression,
		ParameterExpression source,
		Expression target)
	{
		return new ParameterReplacerVisitor<TOutput>(source, target).VisitAndConvert(expression);
	}
}
